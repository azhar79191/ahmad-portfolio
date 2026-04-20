"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import { GetNotifications, MarkNotificationRead, MarkAllNotificationsRead } from "../services/notifications";

export function useNotifications() {
  const { notifications, setNotifications, markRead, markAllRead, ...rest } = useNotificationStore();

  useEffect(() => {
    GetNotifications()
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setNotifications(list);
      })
      .catch(console.error);
  }, []);

  const handleMarkRead = async (id: number) => {
    markRead(id);
    await MarkNotificationRead(id).catch(() => markRead(id));
  };

  const handleMarkAllRead = async () => {
    markAllRead();
    await MarkAllNotificationsRead().catch(() => markAllRead());
  };

  return { notifications, markRead: handleMarkRead, markAllRead: handleMarkAllRead, ...rest };
}
