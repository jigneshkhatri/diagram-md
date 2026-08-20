import Link from "next/link";

interface ToolbarProps {
  projectName: string;
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  onToggleDocumentPane: () => void;
  onToggleDiagramPane: () => void;
}

export default function Toolbar({
  projectName,
  dirty,
  saving,
  onSave,
  onToggleDocumentPane,
  onToggleDiagramPane,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-black/10 px-4 py-2 dark:border-white/10">
      <div className="flex items-center gap-3">
        <Link href="/projects" className="text-sm text-black/50 hover:underline dark:text-white/50">
          ← Projects
        </Link>
        <span className="font-medium">{projectName}</span>
        {dirty && <span className="text-xs text-amber-600 dark:text-amber-400">Unsaved changes</span>}
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onToggleDocumentPane}
          className="rounded-md border border-black/15 px-2 py-1 text-xs hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
        >
          Toggle doc
        </button>
        <button
          type="button"
          onClick={onToggleDiagramPane}
          className="rounded-md border border-black/15 px-2 py-1 text-xs hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
        >
          Toggle diagram
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
