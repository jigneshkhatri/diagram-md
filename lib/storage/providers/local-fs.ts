import type { DocumentMeta, ProjectManifest, ProjectRegistryEntry } from "@/lib/types";
import type { DocumentContent, ProjectStorage, StorageProvider } from "@/lib/storage/types";

const MANIFEST_FILE_NAME = "manifest.json";

async function ensurePermission(dir: FileSystemDirectoryHandle): Promise<void> {
  const descriptor: FileSystemHandlePermissionDescriptor = { mode: "readwrite" };
  if ((await dir.queryPermission(descriptor)) === "granted") return;
  if ((await dir.requestPermission(descriptor)) !== "granted") {
    throw new Error("Permission to access this project folder was not granted.");
  }
}

async function readTextFile(dir: FileSystemDirectoryHandle, name: string): Promise<string> {
  const fileHandle = await dir.getFileHandle(name);
  const file = await fileHandle.getFile();
  return file.text();
}

async function writeTextFile(dir: FileSystemDirectoryHandle, name: string, contents: string): Promise<void> {
  const fileHandle = await dir.getFileHandle(name, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}

class LocalFsProjectStorage implements ProjectStorage {
  readonly providerId = "local-fs";

  constructor(private readonly dir: FileSystemDirectoryHandle) {}

  async readManifest(): Promise<ProjectManifest> {
    await ensurePermission(this.dir);
    return JSON.parse(await readTextFile(this.dir, MANIFEST_FILE_NAME)) as ProjectManifest;
  }

  async writeManifest(manifest: ProjectManifest): Promise<void> {
    await ensurePermission(this.dir);
    await writeTextFile(this.dir, MANIFEST_FILE_NAME, JSON.stringify(manifest, null, 2));
  }

  async readDocument(doc: DocumentMeta): Promise<DocumentContent> {
    await ensurePermission(this.dir);
    const [markdown, diagram] = await Promise.all([
      readTextFile(this.dir, doc.mdFileName),
      readTextFile(this.dir, doc.diagramFileName),
    ]);
    return { markdown, diagram };
  }

  async writeDocument(doc: DocumentMeta, content: DocumentContent): Promise<void> {
    await ensurePermission(this.dir);
    await Promise.all([
      writeTextFile(this.dir, doc.mdFileName, content.markdown),
      writeTextFile(this.dir, doc.diagramFileName, content.diagram),
    ]);
  }

  async deleteDocument(doc: DocumentMeta): Promise<void> {
    await ensurePermission(this.dir);
    await Promise.allSettled([this.dir.removeEntry(doc.mdFileName), this.dir.removeEntry(doc.diagramFileName)]);
  }
}

function toRegistryEntry(manifest: Pick<ProjectManifest, "id" | "name">, dir: FileSystemDirectoryHandle): ProjectRegistryEntry {
  return {
    id: manifest.id,
    name: manifest.name,
    providerId: localFsProvider.id,
    providerData: dir,
    lastOpenedAt: new Date().toISOString(),
  };
}

export const localFsProvider: StorageProvider = {
  id: "local-fs",
  label: "Local File System",

  isAvailable(): boolean {
    return typeof window !== "undefined" && "showDirectoryPicker" in window;
  },

  async createProject(name) {
    const dir = await window.showDirectoryPicker({ mode: "readwrite" });
    const now = new Date().toISOString();
    const manifest: ProjectManifest = {
      version: 1,
      id: crypto.randomUUID(),
      name,
      createdAt: now,
      updatedAt: now,
      documents: [],
    };
    await writeTextFile(dir, MANIFEST_FILE_NAME, JSON.stringify(manifest, null, 2));
    return { registryEntry: toRegistryEntry(manifest, dir), storage: new LocalFsProjectStorage(dir) };
  },

  async browseForProject() {
    const dir = await window.showDirectoryPicker({ mode: "readwrite" });
    const manifest = JSON.parse(await readTextFile(dir, MANIFEST_FILE_NAME)) as ProjectManifest;
    return { registryEntry: toRegistryEntry(manifest, dir), storage: new LocalFsProjectStorage(dir) };
  },

  async openProject(registryEntry) {
    const dir = registryEntry.providerData as FileSystemDirectoryHandle;
    await ensurePermission(dir);
    return new LocalFsProjectStorage(dir);
  },
};
