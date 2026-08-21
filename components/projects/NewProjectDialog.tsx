"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
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
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!provider || !name.trim()) return;
          onCreate(name.trim(), provider);
        }}
        className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-neutral-900"
      >
        <h2 className="text-lg font-semibold">New project</h2>

        <label className="mt-4 block text-sm font-medium">
          Name
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-1 focus:ring-accent dark:border-white/15 dark:bg-transparent"
            placeholder="My project"
          />
        </label>

        <label className="mt-3 block text-sm font-medium">
          Storage
          <select
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className="mt-1 w-full rounded-md border border-black/15 px-3 py-2 text-sm outline-none transition focus:border-accent focus:ring-1 focus:ring-accent dark:border-white/15 dark:bg-transparent"
          >
            {providers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!name.trim() || submitting}>
            {submitting ? "Creating…" : "Create"}
          </Button>
        </div>
      </form>
    </div>
  );
}
