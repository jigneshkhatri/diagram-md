import type { DocumentMeta } from "@/lib/types";

interface DocumentSidebarProps {
  documents: DocumentMeta[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function DocumentSidebar({
  documents,
  selectedId,
  onSelect,
  onCreate,
  onRename,
  onDelete,
}: DocumentSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-black/10 px-3 py-2 dark:border-white/10">
        <span className="text-sm font-medium">Documents</span>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-md px-2 py-1 text-sm hover:bg-black/5 dark:hover:bg-white/10"
          title="New document"
        >
          +
        </button>
      </div>
      <ul className="flex-1 overflow-y-auto p-2">
        {documents.map((doc) => (
          <li key={doc.id} className="group flex items-center gap-1">
            <button
              type="button"
              onClick={() => onSelect(doc.id)}
              className={`flex-1 truncate rounded-md px-2 py-1.5 text-left text-sm ${
                doc.id === selectedId
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {doc.title}
            </button>
            <button
              type="button"
              onClick={() => onRename(doc.id)}
              className="hidden rounded px-1 text-xs text-black/50 hover:bg-black/5 group-hover:block dark:text-white/50 dark:hover:bg-white/10"
              title="Rename"
            >
              ✎
            </button>
            <button
              type="button"
              onClick={() => onDelete(doc.id)}
              className="hidden rounded px-1 text-xs text-black/50 hover:bg-black/5 group-hover:block dark:text-white/50 dark:hover:bg-white/10"
              title="Delete"
            >
              ✕
            </button>
          </li>
        ))}
        {documents.length === 0 && <li className="px-2 py-1.5 text-xs text-black/40 dark:text-white/40">No documents yet.</li>}
      </ul>
    </div>
  );
}
