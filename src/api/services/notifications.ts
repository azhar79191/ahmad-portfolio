import api from "../axiosInstance"
import { API_ENDPOINTS } from "../endpoints"

export const GetNotifications = async () => {
  const res = await api.get(API_ENDPOINTS.NOTIFICATIONS.GET_NOTIFICATIONS);
  return res.data;
};

export const MarkNotificationRead = async (id: number) => {
  const res = await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ(id));
  return res.data;
};

export const MarkAllNotificationsRead = async () => {
  const res = await api.post(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ);
  return res.data;
};

export const GetUnreadCount = async () => {
  const res = await api.get(API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT);
  return res.data;
};