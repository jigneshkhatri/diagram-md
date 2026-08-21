import type { DocumentMeta } from "@/lib/types";
import Button from "@/components/ui/Button";
import { PencilIcon, PlusIcon, TrashIcon } from "@/components/ui/icons";

interface DocumentSidebarProps {
  documents: DocumentMeta[];
  selectedId: string | null;
  /** Compact rail mode — shows document initials instead of full titles. */
  narrow?: boolean;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

function initials(title: string): string {
  return title.trim().slice(0, 2).toUpperCase() || "?";
}

export default function DocumentSidebar({
  documents,
  selectedId,
  narrow,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: DocumentSidebarProps) {
  if (narrow) {
    return (
      <div className="flex h-full flex-col items-center">
        <div className="flex w-full justify-center border-b border-black/10 py-2.5 dark:border-white/10">
          <Button variant="ghost" iconOnly onClick={onCreate} title="New document" aria-label="New document">
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
        <ul className="flex-1 space-y-1 overflow-y-auto p-2">
          {documents.map((doc) => (
            <li key={doc.id}>
              <button
                type="button"
                onClick={() => onSelect(doc.id)}
                title={doc.title}
                aria-label={doc.title}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition ${
                  doc.id === selectedId
                    ? "bg-accent text-accent-foreground"
                    : "text-black/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10"
                }`}
              >
                {initials(doc.title)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-black/10 px-3 py-2.5 dark:border-white/10">
        <span className="text-xs font-semibold tracking-wide text-black/50 uppercase dark:text-white/50">Documents</span>
        <Button variant="ghost" iconOnly onClick={onCreate} title="New document" aria-label="New document">
          <PlusIcon className="h-4 w-4" />
        </Button>
      </div>
      <ul className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {documents.map((doc) => (
          <li key={doc.id} className="group flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSelect(doc.id)}
              className={`flex-1 truncate rounded-md px-2 py-1.5 text-left text-sm transition ${
                doc.id === selectedId
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {doc.title}
            </button>
            <button
              type="button"
              onClick={() => onRename(doc.id)}
              className="hidden rounded p-1 text-black/40 hover:bg-black/5 hover:text-black/70 group-hover:block dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white/70"
              title="Rename"
              aria-label="Rename document"
            >
              <PencilIcon className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(doc.id)}
              className="hidden rounded p-1 text-black/40 hover:bg-black/5 hover:text-red-600 group-hover:block dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-red-400"
              title="Delete"
              aria-label="Delete document"
            >
              <TrashIcon className="h-3.5 w-3.5" />
            </button>
          </li>
        ))}
        {documents.length === 0 && <li className="px-2 py-1.5 text-xs text-black/40 dark:text-white/40">No documents yet.</li>}
      </ul>
    </div>
  );
}
