import type { DocumentMeta, ProjectManifest } from "@/lib/types";
import type { DocumentContent, ProjectStorage } from "@/lib/storage/types";
import { slugify, uniqueSlug } from "@/lib/filename";

export const EMPTY_DIAGRAM = JSON.stringify({
  type: "excalidraw",
  version: 2,
  source: "diagram-md",
  elements: [],
  appState: {},
  files: {},
});

function slugOf(doc: DocumentMeta): string {
  return doc.mdFileName.replace(/\.md$/, "");
}

export async function createDocument(
  storage: ProjectStorage,
  manifest: ProjectManifest,
  title: string,
): Promise<ProjectManifest> {
  const now = new Date().toISOString();
  const slug = uniqueSlug(slugify(title), new Set(manifest.documents.map(slugOf)));
  const doc: DocumentMeta = {
    id: crypto.randomUUID(),
    title,
    mdFileName: `${slug}.md`,
    diagramFileName: `${slug}.excalidraw`,
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
  const doc = manifest.documents.find((d) => d.id === documentId);
  if (!doc) return manifest;

  const now = new Date().toISOString();
  const existingSlugs = new Set(manifest.documents.filter((d) => d.id !== documentId).map(slugOf));
  const newSlug = uniqueSlug(slugify(title), existingSlugs);

  let updatedDoc: DocumentMeta = { ...doc, title, updatedAt: now };

  if (newSlug !== slugOf(doc)) {
    // Files are named after the title, so a rename that changes the slug
    // means moving the content to new files and dropping the old ones.
    const content = await storage.readDocument(doc);
    updatedDoc = { ...updatedDoc, mdFileName: `${newSlug}.md`, diagramFileName: `${newSlug}.excalidraw` };
    await storage.writeDocument(updatedDoc, content);
    await storage.deleteDocument(doc);
  }

  const updated: ProjectManifest = {
    ...manifest,
    updatedAt: now,
    documents: manifest.documents.map((d) => (d.id === documentId ? updatedDoc : d)),
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
