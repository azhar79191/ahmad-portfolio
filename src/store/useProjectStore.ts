import { create } from "zustand";

export type Project = {
  id: number;
  title: string;
  category: string;
  tech: string[];
  status: "Live" | "In Progress" | "Archived";
  year: string;
  github: string;
  live: string;
  desc: string;
  image?: string; // base64 preview or URL
};

type ProjectStore = {
  projects: Project[];
  search: string;
  filterStatus: string;
  setSearch: (v: string) => void;
  setFilterStatus: (v: string) => void;
  setProjects: (p: Project[]) => void;
  addProject: (p: Omit<Project, "id">) => void;
  updateProject: (id: number, p: Omit<Project, "id">) => void;
  deleteProject: (id: number) => void;
};

const initialProjects: Project[] = [
  { id: 1, title: "E-Commerce Platform", category: "Full-Stack", tech: ["NextJS", "Django", "PostgreSQL"], status: "Live", year: "2024", github: "https://github.com/", live: "#", desc: "Full-stack e-commerce app with cart, payments, and admin dashboard." },
  { id: 2, title: "Real Estate App", category: "Full-Stack", tech: ["ReactJS", "Laravel", "MySQL"], status: "Live", year: "2024", github: "https://github.com/", live: "#", desc: "Property listing platform with search filters and agent profiles." },
  { id: 3, title: "Portfolio CMS", category: "Full-Stack", tech: ["NextJS", "Django REST"], status: "Live", year: "2023", github: "https://github.com/", live: "#", desc: "Dynamic portfolio with a custom CMS for managing projects and blogs." },
  { id: 4, title: "Task Management Tool", category: "Frontend", tech: ["ReactJS", "Node.js"], status: "Live", year: "2023", github: "https://github.com/", live: "#", desc: "Kanban-style task manager with drag-and-drop and team collaboration." },
  { id: 5, title: "AI Chat Dashboard", category: "Frontend", tech: ["NextJS", "OpenAI API"], status: "In Progress", year: "2024", github: "https://github.com/", live: "#", desc: "Conversational AI dashboard with streaming responses." },
  { id: 6, title: "Restaurant Booking System", category: "Full-Stack", tech: ["ReactJS", "Django", "Celery"], status: "Live", year: "2023", github: "https://github.com/", live: "#", desc: "Online reservation system with table management." },
  { id: 7, title: "Crypto Tracker", category: "Frontend", tech: ["NextJS", "CoinGecko API"], status: "Live", year: "2022", github: "https://github.com/", live: "#", desc: "Real-time cryptocurrency tracker with interactive charts." },
  { id: 8, title: "Blog Platform", category: "Backend", tech: ["Django", "PostgreSQL", "AWS S3"], status: "Archived", year: "2022", github: "https://github.com/", live: "#", desc: "Headless blog platform with REST API and full-text search." },
];

export const useProjectStore = create<ProjectStore>((set) => ({
  projects: [],
  search: "",
  filterStatus: "All",
  setSearch: (v) => set({ search: v }),
  setFilterStatus: (v) => set({ filterStatus: v }),
  setProjects: (p) => set({ projects: p }),
  addProject: (p) =>
    set((s) => ({ projects: [...s.projects, { ...p, id: Date.now() }] })),
  updateProject: (id, p) =>
    set((s) => ({ projects: s.projects.map((x) => (x.id === id ? { ...p, id } : x)) })),
  deleteProject: (id) =>
    set((s) => ({ projects: s.projects.filter((x) => x.id !== id) })),
}));
