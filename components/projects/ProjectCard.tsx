import type { ProjectRegistryEntry } from "@/lib/types";

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
      className="flex flex-col items-start gap-1 rounded-lg border border-black/10 bg-white p-4 text-left transition hover:border-black/20 hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
    >
      <span className="font-medium">{entry.name}</span>
      <span className="text-xs text-black/50 dark:text-white/50">
        Last opened {new Date(entry.lastOpenedAt).toLocaleString()}
      </span>
    </button>
  );
}
