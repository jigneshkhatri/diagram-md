import Link from "next/link";
import Button from "@/components/ui/Button";
import Switch from "@/components/ui/Switch";
import { DocumentIcon, FolderIcon, ShapesIcon, SidebarIcon } from "@/components/ui/icons";

interface ToolbarProps {
  projectName: string;
  locationLabel: string | null;
  dirty: boolean;
  saving: boolean;
  onSave: () => void;
  autosaveEnabled: boolean;
  onToggleAutosave: (enabled: boolean) => void;
  sidebarNarrow: boolean;
  onToggleSidebar: () => void;
  documentPaneVisible: boolean;
  diagramPaneVisible: boolean;
  onToggleDocumentPane: () => void;
  onToggleDiagramPane: () => void;
}

export default function Toolbar({
  projectName,
  locationLabel,
  dirty,
  saving,
  onSave,
  autosaveEnabled,
  onToggleAutosave,
  sidebarNarrow,
  onToggleSidebar,
  documentPaneVisible,
  diagramPaneVisible,
  onToggleDocumentPane,
  onToggleDiagramPane,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-black/10 bg-white/80 px-4 py-2.5 backdrop-blur-sm dark:border-white/10 dark:bg-black/50">
      <div className="flex min-w-0 items-center gap-3">
        <Link href="/projects" className="shrink-0 text-sm text-black/50 transition hover:text-accent dark:text-white/50">
          ← Projects
        </Link>
        <span className="truncate font-semibold">{projectName}</span>
        {locationLabel && (
          <span
            className="hidden shrink-0 items-center gap-1 text-xs text-black/40 sm:flex dark:text-white/40"
            title={`Folder name: ${locationLabel} (browsers don't expose the full filesystem path to web pages)`}
          >
            <FolderIcon className="h-3.5 w-3.5" />
            <span className="max-w-40 truncate">{locationLabel}</span>
          </span>
        )}
        {dirty && (
          <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            Unsaved
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          variant="ghost"
          iconOnly
          onClick={onToggleSidebar}
          title="Toggle sidebar"
          aria-label="Toggle sidebar"
          aria-pressed={!sidebarNarrow}
          className={!sidebarNarrow ? "bg-accent/10 text-accent" : ""}
        >
          <SidebarIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          iconOnly
          onClick={onToggleDocumentPane}
          title="Toggle document pane"
          aria-label="Toggle document pane"
          aria-pressed={documentPaneVisible}
          className={documentPaneVisible ? "bg-accent/10 text-accent" : ""}
        >
          <DocumentIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          iconOnly
          onClick={onToggleDiagramPane}
          title="Toggle diagram pane"
          aria-label="Toggle diagram pane"
          aria-pressed={diagramPaneVisible}
          className={diagramPaneVisible ? "bg-accent/10 text-accent" : ""}
        >
          <ShapesIcon className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" aria-hidden="true" />

        <Switch checked={autosaveEnabled} onChange={onToggleAutosave} label="Autosave" />

        <Button variant="primary" onClick={onSave} disabled={!dirty || saving} title="Ctrl+S">
          {saving ? "Saving…" : "Save (Ctrl+S)"}
        </Button>
      </div>
    </div>
  );
}
