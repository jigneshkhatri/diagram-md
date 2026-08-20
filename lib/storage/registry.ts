import { get, set } from "idb-keyval";
import type { ProjectRegistryEntry } from "@/lib/types";

const REGISTRY_KEY = "diagram-md:project-registry";

export async function listProjects(): Promise<ProjectRegistryEntry[]> {
  return (await get<ProjectRegistryEntry[]>(REGISTRY_KEY)) ?? [];
}

export async function addProject(entry: ProjectRegistryEntry): Promise<void> {
  const projects = await listProjects();
  const withoutExisting = projects.filter((p) => p.id !== entry.id);
  await set(REGISTRY_KEY, [...withoutExisting, entry]);
}

export async function touchProject(id: string): Promise<void> {
  const projects = await listProjects();
  await set(
    REGISTRY_KEY,
    projects.map((p) => (p.id === id ? { ...p, lastOpenedAt: new Date().toISOString() } : p)),
  );
}

export async function removeProject(id: string): Promise<void> {
  const projects = await listProjects();
  await set(
    REGISTRY_KEY,
    projects.filter((p) => p.id !== id),
  );
}
