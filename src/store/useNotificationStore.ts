import { create } from "zustand";

export type NotificationType = "message" | "project" | "testimonial" | "system";

export type Notification = {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  created_at: string;
  is_read: boolean;
};

type NotificationStore = {
  notifications: Notification[];
  activeFilter: string;
  setNotifications: (n: Notification[]) => void;
  setActiveFilter: (v: string) => void;
  markRead: (id: number) => void;
  markAllRead: () => void;
  unreadCount: () => number;
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  activeFilter: "All",
  setNotifications: (n) => set({ notifications: n }),
  setActiveFilter: (v) => set({ activeFilter: v }),
  markRead: (id) =>
    set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)) })),
  markAllRead: () =>
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, is_read: true })) })),
  unreadCount: () => get().notifications.filter((n) => !n.is_read).length,
}));
