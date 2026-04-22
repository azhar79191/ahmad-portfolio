"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/src/store/useNotificationStore";
import { GetNotifications, MarkNotificationRead, MarkAllNotificationsRead } from "../services/notifications";

export function useNotifications() {
  const { notifications, setNotifications, markRead, markAllRead, ...rest } = useNotificationStore();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await GetNotifications();
        const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setNotifications(list);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await MarkNotificationRead(id);
      markRead(id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await MarkAllNotificationsRead();
      markAllRead();
    } catch (err) {
      console.error(err);
    }
  };

  return { notifications, markRead: handleMarkRead, markAllRead: handleMarkAllRead, ...rest };
}
