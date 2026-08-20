import { localFsProvider } from "@/lib/storage/providers/local-fs";
import type { StorageProvider } from "@/lib/storage/types";

export const providers: Record<string, StorageProvider> = {
  [localFsProvider.id]: localFsProvider,
};

export function availableProviders(): StorageProvider[] {
  return Object.values(providers).filter((p) => p.isAvailable());
}

export type { DocumentContent, ProjectStorage, StorageProvider } from "@/lib/storage/types";
