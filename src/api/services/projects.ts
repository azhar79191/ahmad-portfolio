import api from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

export const GetProjects = async () => {
  const res = await api.get(API_ENDPOINTS.PROJECTS.GET_PROJECTS);
  return res.data;
};

const STATUS_MAP: Record<string, string> = {
  "Live": "live",
  "In Progress": "in progress",
  "Archived": "archived",
};

export const PostProject = async (data: {
  title: string;
  category: string;
  tech: string[];
  status: string;
  year: string;
  github: string;
  live: string;
  desc: string;
  image?: string;
}) => {
  const payload: Record<string, any> = {
    title: data.title,
    category: data.category,
    tech_stack: data.tech.join(", "),
    status: STATUS_MAP[data.status] ?? data.status,
    year: data.year,
    github_url: data.github,
    live_url: data.live,
    description: data.desc,
  };

  if (data.image?.startsWith("data:")) {
    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
    const blob = await fetch(data.image).then(r => r.blob());
    formData.append("image", blob, "image.jpg");
    return (await api.post(API_ENDPOINTS.PROJECTS.SEND_PROJECTS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  }

  return (await api.post(API_ENDPOINTS.PROJECTS.SEND_PROJECTS, payload)).data;
};

export const PatchProject = async (id: number, data: {
  title: string;
  category: string;
  tech: string[];
  status: string;
  year: string;
  github: string;
  live: string;
  desc: string;
  image?: string;
}) => {
  const payload: Record<string, any> = {
    title: data.title,
    category: data.category,
    tech_stack: data.tech.join(", "),
    status: STATUS_MAP[data.status] ?? data.status,
    year: data.year,
    github_url: data.github,
    live_url: data.live,
    description: data.desc,
  };

  if (data.image?.startsWith("data:")) {
    const formData = new FormData();
    Object.entries(payload).forEach(([k, v]) => formData.append(k, v));
    const blob = await fetch(data.image).then(r => r.blob());
    formData.append("image", blob, "image.jpg");
    return (await api.patch(API_ENDPOINTS.PROJECTS.PATCH_PROJECT(id), formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })).data;
  }

  return (await api.patch(API_ENDPOINTS.PROJECTS.PATCH_PROJECT(id), payload)).data;
};

export const DeleteProject = async (id: number) => {
  const res = await api.delete(API_ENDPOINTS.PROJECTS.DELETE_PROJECTS(id));
  return res.data;
};
export const SearchProjects = async (searchTerm:string) => {
  const res = await api.get(API_ENDPOINTS.PROJECTS.SEARCH_PROJECTS(searchTerm));
  return res.data;
}
