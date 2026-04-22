import { create } from "zustand";

export type Project = {
  id: number;
  title: string;
  category: string;
  tech_stack: string;
  status: string;
  year: string;
  github_url: string;
  live_url: string;
  description: string;
  image?: string | null;
};

type ProjectStore = {
  projects: Project[];
  search: string;
  filterStatus: string;
  setSearch: (v: string) => void;
  setFilterStatus: (v: string) => void;
  setProjects: (p: Project[]) => void;
  addProject: (p: Project) => void;
  updateProject: (id: number, p: Partial<Project>) => void;
  deleteProject: (id: number) => void;
};

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  search: "",
  filterStatus: "All",
  setSearch: (v) => set({ search: v }),
  setFilterStatus: (v) => set({ filterStatus: v }),
  setProjects: (p) => set({ projects: p }),
  addProject: (p) => set((s) => ({ projects: [p, ...s.projects] })),
  updateProject: (id, p) => set((s) => ({ projects: s.projects.map((x) => (x.id === id ? { ...x, ...p } : x)) })),
  deleteProject: (id) => set((s) => ({ projects: s.projects.filter((x) => x.id !== id) })),
}));
