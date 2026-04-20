import api from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

export const SendQueries = async (name: string, email: string, subject: string, message: string) => {
  const res = await api.post(API_ENDPOINTS.QUERIES.POST, { name, email, subject, message });
  return res.data;
};

const normalizeQuery = (q: any) => ({
  id: q.id,
  name: q.name,
  email: q.email,
  subject: q.subject ?? "",
  message: q.message,
  date: q.created_at ?? "",
  read: q.status === "read",
});

export const fetchAllQueries = async () => {
  const res = await api.get(API_ENDPOINTS.QUERIES.GET_ALL);
  const raw = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
  return raw.map(normalizeQuery);
};

export const patchQuery = async (id: number, data: Partial<{ read: boolean }>) => {
  const res = await api.patch(API_ENDPOINTS.QUERIES.PATCH(id), data);
  return normalizeQuery(res.data);
};

export const removeQuery = async (id: number) => {
  await api.delete(API_ENDPOINTS.QUERIES.DELETE(id));
};

export const markReadById = async (id: number) => {
  const res = await api.post(API_ENDPOINTS.QUERIES.MARKREAD(id));
  return normalizeQuery(res.data);
};

export const markAllRead = async () => {
  const res = await api.post(API_ENDPOINTS.QUERIES.MARKALLREAD);
  return res.data;
};