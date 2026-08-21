import type { DocumentMeta, ProjectManifest, ProjectRegistryEntry } from "@/lib/types";

export interface DocumentContent {
  markdown: string;
  /** Raw `.excalidraw` scene JSON text (as produced by Excalidraw's serializeAsJSON). */
  diagram: string;
}

export interface ProjectStorage {
  readonly providerId: string;
  /**
   * Human-readable label for where this project lives (e.g. a folder name),
   * or null if the provider has nothing meaningful to show. Never a full
   * filesystem path — browsers don't expose that to web pages.
   */
  readonly locationLabel: string | null;
  readManifest(): Promise<ProjectManifest>;
  writeManifest(manifest: ProjectManifest): Promise<void>;
  readDocument(doc: DocumentMeta): Promise<DocumentContent>;
  writeDocument(doc: DocumentMeta, content: DocumentContent): Promise<void>;
  deleteDocument(doc: DocumentMeta): Promise<void>;
}

export interface StorageProvider {
  id: string;
  label: string;
  isAvailable(): boolean;
  createProject(name: string): Promise<{ registryEntry: ProjectRegistryEntry; storage: ProjectStorage }>;
  /** Pick an existing project location the app doesn't know about yet and register it. */
  browseForProject(): Promise<{ registryEntry: ProjectRegistryEntry; storage: ProjectStorage }>;
  /** Reopen a project already in the registry. */
  openProject(registryEntry: ProjectRegistryEntry): Promise<ProjectStorage>;
}
