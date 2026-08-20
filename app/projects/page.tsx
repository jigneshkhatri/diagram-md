"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/projects/ProjectCard";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import UnsupportedBrowserNotice from "@/components/projects/UnsupportedBrowserNotice";
import { availableProviders } from "@/lib/storage";
import { addProject, listProjects } from "@/lib/storage/registry";
import type { ProjectRegistryEntry } from "@/lib/types";
import type { StorageProvider } from "@/lib/storage/types";

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

const NO_PROVIDERS: StorageProvider[] = [];
function subscribeNoop() {
  return () => {};
}
function getServerProviders() {
  return NO_PROVIDERS;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ProjectRegistryEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Provider availability depends on `window`, which differs between the SSR
  // pass and the client — useSyncExternalStore is the correct primitive for
  // a value like this (server snapshot vs. client snapshot, static after mount).
  const providers = useSyncExternalStore(subscribeNoop, availableProviders, getServerProviders);

  useEffect(() => {
    listProjects().then((projects) => {
      setEntries(projects);
      setLoaded(true);
    });
  }, []);

  async function handleCreate(name: string, provider: StorageProvider) {
    setBusy(true);
    setError(null);
    try {
      const { registryEntry } = await provider.createProject(name);
      await addProject(registryEntry);
      router.push(`/projects/${registryEntry.id}`);
    } catch (err) {
      if (!isAbortError(err)) setError(err instanceof Error ? err.message : "Failed to create project.");
      setBusy(false);
    }
  }

  async function handleOpenExisting(provider: StorageProvider) {
    setBusy(true);
    setError(null);
    try {
      const { registryEntry } = await provider.browseForProject();
      await addProject(registryEntry);
      router.push(`/projects/${registryEntry.id}`);
    } catch (err) {
      if (!isAbortError(err)) setError(err instanceof Error ? err.message : "Failed to open project.");
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Projects</h1>
        {providers.length > 0 && (
          <div className="flex gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => handleOpenExisting(providers[0])}
              className="rounded-md border border-black/15 px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-50 dark:border-white/15 dark:hover:bg-white/10"
            >
              Open existing
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => setShowNewProject(true)}
              className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
            >
              New project
            </button>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      )}

      {providers.length === 0 && (
        <div className="mt-6">
          <UnsupportedBrowserNotice />
        </div>
      )}

      {loaded && entries.length === 0 && providers.length > 0 && (
        <p className="mt-8 text-sm text-black/50 dark:text-white/50">
          No projects yet. Create a new one or open an existing project folder.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {entries.map((entry) => (
          <ProjectCard
            key={entry.id}
            entry={entry}
            disabled={busy}
            onOpen={(e) => router.push(`/projects/${e.id}`)}
          />
        ))}
      </div>

      {showNewProject && (
        <NewProjectDialog
          providers={providers}
          submitting={busy}
          onCancel={() => setShowNewProject(false)}
          onCreate={handleCreate}
        />
      )}
    </main>
  );
}
