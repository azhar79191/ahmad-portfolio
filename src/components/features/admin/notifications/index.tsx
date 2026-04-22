"use client";

import { useNotifications } from "@/src/api/hooks/useNotifications";
import type { Notification } from "@/src/store/useNotificationStore";

const typeConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  message: {
    bg: "bg-violet-900/40", text: "text-violet-400",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
  project: {
    bg: "bg-blue-900/40", text: "text-blue-400",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  },
  testimonial: {
    bg: "bg-emerald-900/40", text: "text-emerald-400",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
  },
  system: {
    bg: "bg-amber-900/40", text: "text-amber-400",
    icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  },
};

const filters = ["All", "Unread", "Messages", "Projects", "Testimonials", "System"];

export default function NotificationsView() {
  const { notifications, activeFilter, setActiveFilter, markRead, markAllRead, unreadCount } = useNotifications();

  // derive unique types from actual response
  const typeFilters = ["All", "Unread", ...Array.from(new Set(notifications.map((n) => n.type)))];

  const filterMap: Record<string, (n: Notification) => boolean> = {
    All: () => true,
    Unread: (n) => !n.is_read,
    ...Object.fromEntries(
      Array.from(new Set(notifications.map((n) => n.type))).map((type) => [
        type,
        (n: Notification) => n.type === type,
      ])
    ),
  };
  const unread = unreadCount();

 const filtered = notifications.filter((n) => {
  const filterFn = filterMap[activeFilter];
  return filterFn ? filterFn(n) : true;
});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">All Notifications</h2>
          <p className="text-sm text-gray-500 mt-0.5">{unread} unread notification{unread !== 1 ? "s" : ""}</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead}
            className="text-sm text-violet-400 hover:text-violet-300 border border-violet-800 hover:border-violet-600 px-4 py-1.5 rounded-lg transition-all">
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {typeFilters.map((f) => (
          <button key={f} onClick={() => setActiveFilter(f)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              activeFilter === f
                ? "bg-violet-600 border-violet-600 text-white"
                : "bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-600 hover:text-gray-900 dark:hover:text-white"
            }`}>
            {f}
            {f === "Unread" && unread > 0 && (
              <span className="ml-1.5 bg-violet-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unread}</span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-800/60">
        {filtered.length === 0 && (
          <div className="py-16 text-center text-gray-600">
            <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            No notifications found
          </div>
        )}
        {filtered.map((n) => {
          const cfg = typeConfig[n.type] ?? typeConfig["system"];
          return (
            <div key={n.id}
              className={`flex items-start gap-4 px-5 py-4 group transition-colors ${!n.is_read ? "bg-violet-50 dark:bg-gray-900/60" : "hover:bg-gray-50 dark:hover:bg-gray-900/30"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg} ${cfg.text}`}>
                {cfg.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-sm font-semibold ${n.is_read ? "text-gray-500 dark:text-gray-300" : "text-gray-900 dark:text-white"}`}>{n.title}</p>
                  <span className="text-xs text-gray-400 dark:text-gray-600 whitespace-nowrap flex-shrink-0">{n.created_at}</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>
                <div className="flex items-center gap-3 mt-2">
                  {!n.is_read && (
                    <button onClick={() => markRead(n.id)} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
              {!n.is_read && <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-2" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
