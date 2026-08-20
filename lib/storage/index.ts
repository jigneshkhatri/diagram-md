import { localFsProvider } from "@/lib/storage/providers/local-fs";
import type { StorageProvider } from "@/lib/storage/types";

export const providers: Record<string, StorageProvider> = {
  [localFsProvider.id]: localFsProvider,
};

// Cached so repeated calls return the same array reference (feature detection
// is static for a given browser session) — required for safe use with
// useSyncExternalStore, whose getSnapshot must be referentially stable.
let cachedAvailableProviders: StorageProvider[] | null = null;

export function availableProviders(): StorageProvider[] {
  if (!cachedAvailableProviders) {
    cachedAvailableProviders = Object.values(providers).filter((p) => p.isAvailable());
  }
  return cachedAvailableProviders;
}

export type { DocumentContent, ProjectStorage, StorageProvider } from "@/lib/storage/types";
