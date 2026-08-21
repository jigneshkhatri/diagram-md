import Link from "next/link";

interface ToolbarProps {
  projectName: string;
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  autosaveEnabled: boolean;
  onToggleAutosave: (enabled: boolean) => void;
  onToggleDocumentPane: () => void;
  onToggleDiagramPane: () => void;
}

export default function Toolbar({
  projectName,
  dirty,
  saving,
  onSave,
  autosaveEnabled,
  onToggleAutosave,
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
      <div className="flex items-center gap-3">
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

        <label className="flex items-center gap-2 text-xs text-black/70 dark:text-white/70">
          Autosave
          <button
            type="button"
            role="switch"
            aria-checked={autosaveEnabled}
            onClick={() => onToggleAutosave(!autosaveEnabled)}
            className={`relative h-5 w-9 rounded-full transition-colors ${
              autosaveEnabled ? "bg-black dark:bg-white" : "bg-black/20 dark:bg-white/20"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all dark:bg-black ${
                autosaveEnabled ? "left-[18px]" : "left-0.5"
              }`}
            />
          </button>
        </label>

        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || saving}
          title="Ctrl+S"
          className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {saving ? "Saving…" : "Save (Ctrl+S)"}
        </button>
      </div>
    </div>
  );
}
