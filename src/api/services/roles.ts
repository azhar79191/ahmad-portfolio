import api from "../axiosInstance"
import { API_ENDPOINTS } from "../endpoints"

export const GetUsers = async () => {
  const res = await api.get(API_ENDPOINTS.ROLES.GETROLES);
  return res.data;
}

export const SendRoles = async (data: {
  name: string;
  email: string;
  role: string;
}) => {
  const res = await api.post(API_ENDPOINTS.ROLES.POSTROLES, data);
  return res.data;
}

export const UpdateUser = async (id: number, data: {
  name: string;
  email: string;
  role: string;
}) => {
  const res = await api.patch(API_ENDPOINTS.ROLES.UPDATEUSER(id), data);
  return res.data;
}

export const DeleteUser = async (id: number) => {
  const res = await api.delete(API_ENDPOINTS.ROLES.DELETEUSER(id));
  return res.data;
}

export const RevokeAccess = async (id: number) => {
  const res = await api.post(API_ENDPOINTS.ROLES.REVOKEACCESS(id), {});
  return res.data;
}

