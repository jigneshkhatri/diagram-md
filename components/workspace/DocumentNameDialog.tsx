"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { validateDocumentTitle } from "@/lib/filename";

interface DocumentNameDialogProps {
  heading: string;
  initialValue?: string;
  confirmLabel: string;
  submitting?: boolean;
  submitError?: string | null;
  onCancel: () => void;
  onConfirm: (title: string) => void;
}

export default function DocumentNameDialog({
  heading,
  initialValue = "",
  confirmLabel,
  submitting,
  submitError,
  onCancel,
  onConfirm,
}: DocumentNameDialogProps) {
  const [value, setValue] = useState(initialValue);
  const [touched, setTouched] = useState(false);
  const error = validateDocumentTitle(value);

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setTouched(true);
          if (error) return;
          onConfirm(value.trim());
        }}
        className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-5 shadow-xl dark:border-white/10 dark:bg-neutral-900"
      >
        <h2 className="text-lg font-semibold">{heading}</h2>

        <label className="mt-4 block text-sm font-medium">
          Name
          <input
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setTouched(true);
            }}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm outline-none transition dark:bg-transparent ${
              touched && error
                ? "border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400"
                : "border-black/15 focus:border-accent focus:ring-1 focus:ring-accent dark:border-white/15"
            }`}
            placeholder="Document title"
          />
        </label>
        {touched && error ? (
          <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
        ) : (
          <p className="mt-1.5 text-xs text-black/40 dark:text-white/40">
            Saved as a file, e.g. “{value.trim() ? value.trim().toLowerCase().replace(/\s+/g, "-") : "your-title"}.md”
          </p>
        )}
        {submitError && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{submitError}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!!error || submitting}>
            {submitting ? "Saving…" : confirmLabel}
          </Button>
        </div>
      </form>
    </div>
  );
}
