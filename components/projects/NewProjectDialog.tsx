"use client";

import { useState } from "react";
import type { StorageProvider } from "@/lib/storage/types";

interface NewProjectDialogProps {
  providers: StorageProvider[];
  submitting?: boolean;
  onCancel: () => void;
  onCreate: (name: string, provider: StorageProvider) => void;
}

export default function NewProjectDialog({ providers, submitting, onCancel, onCreate }: NewProjectDialogProps) {
  const [name, setName] = useState("");
  const [providerId, setProviderId] = useState(providers[0]?.id ?? "");
  const provider = providers.find((p) => p.id === providerId);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/30 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!provider || !name.trim()) return;
          onCreate(name.trim(), provider);
        }}
        className="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg dark:bg-neutral-900"
      >
        <h2 className="text-lg font-semibold">New project</h2>

        <label className="mt-4 block text-sm font-medium">
          Name
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
            placeholder="My project"
          />
        </label>

        <label className="mt-3 block text-sm font-medium">
          Storage
          <select
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm dark:border-white/15 dark:bg-transparent"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-3 py-1.5 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || submitting}
            className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {submitting ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
