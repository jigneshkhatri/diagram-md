import type { ProjectRegistryEntry } from "@/lib/types";
import { formatRelativeTime } from "@/lib/format-time";

interface ProjectCardProps {
  entry: ProjectRegistryEntry;
  onOpen: (entry: ProjectRegistryEntry) => void;
  disabled?: boolean;
}

export default function ProjectCard({ entry, onOpen, disabled }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      disabled={disabled}
      className="flex flex-col items-start gap-1.5 rounded-xl border border-black/10 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-sm dark:border-white/10 dark:bg-white/[0.03]"
    >
      <span className="flex items-center gap-2 font-medium">
        <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        {entry.name}
      </span>
      <span className="text-xs text-black/50 dark:text-white/50">Opened {formatRelativeTime(entry.lastOpenedAt)}</span>
    </button>
  );
}
