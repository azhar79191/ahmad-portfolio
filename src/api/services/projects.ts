import api from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";
import type { Project } from "@/src/store/useProjectStore";

export const GetProjects = async (page: number = 1, pageSize: number = 10, status?: string) => {
  const res = await api.get(API_ENDPOINTS.PROJECTS.GET_PROJECTS, {
    params: {
      page,
      page_size: pageSize,
      ...(status && status !== "All" && { status: status.toLowerCase() }),
    },
  });
  return res.data;
};

export const PostProject = async (data: Omit<Project, "id">) => {
  const payload: Record<string, any> = {
    title: data.title,
    category: data.category,
    tech_stack: data.tech_stack,
    status: data.status,
    year: data.year,
    github_url: data.github_url,
    live_url: data.live_url,
    description: data.description,
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

export const PatchProject = async (id: number, data: Partial<Omit<Project, "id">>) => {
  const payload: Record<string, any> = {
    title: data.title,
    category: data.category,
    tech_stack: data.tech_stack,
    status: data.status,
    year: data.year,
    github_url: data.github_url,
    live_url: data.live_url,
    description: data.description,
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
