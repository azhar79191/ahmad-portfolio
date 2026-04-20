import api from "../axiosInstance";
import { API_ENDPOINTS } from "../endpoints";

export const GetServices = async () => {
  const res = await api.get(API_ENDPOINTS.SERVICES.GET_ALL);
  return res.data;
};

export const PostService = async (data: object) => {
  const res = await api.post(API_ENDPOINTS.SERVICES.POST, data);
  return res.data;
};

export const PatchService = async (id: number, data: object) => {
  const res = await api.patch(API_ENDPOINTS.SERVICES.PATCH(id), data);
  return res.data;
};

export const DeleteService = async (id: number) => {
  const res = await api.delete(API_ENDPOINTS.SERVICES.DELETE(id));
  return res.data;
};

export const ToggleServiceVisible = async (id: number) => {
  const res = await api.patch(API_ENDPOINTS.SERVICES.TOGGLE_VISIBLE(id), {});
  return res.data;
};
