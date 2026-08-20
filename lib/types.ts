export interface DocumentMeta {
  id: string;
  title: string;
  mdFileName: string;
  diagramFileName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectManifest {
  version: 1;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  documents: DocumentMeta[];
}

export interface ProjectRegistryEntry {
  id: string;
  name: string;
  providerId: string;
  providerData: unknown;
  lastOpenedAt: string;
}
