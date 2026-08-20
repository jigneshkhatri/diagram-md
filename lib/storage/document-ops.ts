import type { DocumentMeta, ProjectManifest } from "@/lib/types";
import type { DocumentContent, ProjectStorage } from "@/lib/storage/types";

export const EMPTY_DIAGRAM = JSON.stringify({
  type: "excalidraw",
  version: 2,
  source: "diagram-md",
  elements: [],
  appState: {},
  files: {},
});

export async function createDocument(
  storage: ProjectStorage,
  manifest: ProjectManifest,
  title: string,
): Promise<ProjectManifest> {
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const doc: DocumentMeta = {
    id,
    title,
    mdFileName: `${id}.md`,
    diagramFileName: `${id}.excalidraw`,
    createdAt: now,
    updatedAt: now,
  };
  await storage.writeDocument(doc, { markdown: "", diagram: EMPTY_DIAGRAM });
  const updated: ProjectManifest = { ...manifest, updatedAt: now, documents: [...manifest.documents, doc] };
  await storage.writeManifest(updated);
  return updated;
}

export async function renameDocument(
  storage: ProjectStorage,
  manifest: ProjectManifest,
  documentId: string,
  title: string,
): Promise<ProjectManifest> {
  const now = new Date().toISOString();
  const updated: ProjectManifest = {
    ...manifest,
    updatedAt: now,
    documents: manifest.documents.map((doc) => (doc.id === documentId ? { ...doc, title, updatedAt: now } : doc)),
  };
  await storage.writeManifest(updated);
  return updated;
}

export async function deleteDocument(
  storage: ProjectStorage,
  manifest: ProjectManifest,
  documentId: string,
): Promise<ProjectManifest> {
  const doc = manifest.documents.find((d) => d.id === documentId);
  if (!doc) return manifest;
  await storage.deleteDocument(doc);
  const now = new Date().toISOString();
  const updated: ProjectManifest = {
    ...manifest,
    updatedAt: now,
    documents: manifest.documents.filter((d) => d.id !== documentId),
  };
  await storage.writeManifest(updated);
  return updated;
}

export async function saveDocument(
  storage: ProjectStorage,
  manifest: ProjectManifest,
  documentId: string,
  content: DocumentContent,
): Promise<ProjectManifest> {
  const doc = manifest.documents.find((d) => d.id === documentId);
  if (!doc) throw new Error(`Document not found: ${documentId}`);
  const now = new Date().toISOString();
  const updatedDoc: DocumentMeta = { ...doc, updatedAt: now };
  await storage.writeDocument(updatedDoc, content);
  const updated: ProjectManifest = {
    ...manifest,
    updatedAt: now,
    documents: manifest.documents.map((d) => (d.id === documentId ? updatedDoc : d)),
  };
  await storage.writeManifest(updated);
  return updated;
}
