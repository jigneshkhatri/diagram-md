"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import ProjectCard from "@/components/projects/ProjectCard";
import NewProjectDialog from "@/components/projects/NewProjectDialog";
import UnsupportedBrowserNotice from "@/components/projects/UnsupportedBrowserNotice";
import Button from "@/components/ui/Button";
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
    <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            diagram<span className="text-accent">·</span>md
          </h1>
          <p className="mt-1 text-sm text-black/50 dark:text-white/50">Your local documentation &amp; diagram projects.</p>
        </div>
        {providers.length > 0 && (
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" disabled={busy} onClick={() => handleOpenExisting(providers[0])}>
              Open existing
            </Button>
            <Button variant="primary" disabled={busy} onClick={() => setShowNewProject(true)}>
              New project
            </Button>
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
        <div className="mt-10 flex flex-col items-center gap-1 rounded-xl border border-dashed border-black/15 py-16 text-center dark:border-white/15">
          <p className="text-sm font-medium">No projects yet</p>
          <p className="text-sm text-black/50 dark:text-white/50">Create a new one or open an existing project folder.</p>
        </div>
      )}

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
