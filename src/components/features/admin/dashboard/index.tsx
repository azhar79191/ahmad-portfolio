"use client";

import Link from "next/link";

const stats = [
  { label: "Total Projects", value: "12", change: "+2 this month", up: true, color: "violet", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg> },
  { label: "Testimonials", value: "9", change: "+1 this month", up: true, color: "cyan", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
  { label: "Contact Queries", value: "24", change: "+5 this week", up: true, color: "emerald", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
  { label: "Unread Messages", value: "7", change: "-3 from last week", up: false, color: "amber", icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
];

const colorMap: Record<string, string> = {
  violet: "bg-violet-900/30 text-violet-400 border-violet-800",
  cyan: "bg-cyan-900/30 text-cyan-400 border-cyan-800",
  emerald: "bg-emerald-900/30 text-emerald-400 border-emerald-800",
  amber: "bg-amber-900/30 text-amber-400 border-amber-800",
};

// Simple SVG bar chart
const monthlyData = [8, 14, 10, 18, 12, 22, 16, 24, 19, 28, 21, 30];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const recentActivity = [
  { action: "New contact query from", subject: "John Smith", time: "2 min ago", type: "query" },
  { action: "Project updated:", subject: "E-Commerce Platform", time: "1 hr ago", type: "project" },
  { action: "New testimonial from", subject: "Sarah Johnson", time: "3 hrs ago", type: "testimonial" },
  { action: "Contact query from", subject: "Ali Hassan", time: "5 hrs ago", type: "query" },
  { action: "Project added:", subject: "AI Chat Dashboard", time: "1 day ago", type: "project" },
  { action: "Testimonial approved:", subject: "Emily Clarke", time: "2 days ago", type: "testimonial" },
];

const typeColor: Record<string, string> = {
  query: "bg-emerald-500",
  project: "bg-violet-500",
  testimonial: "bg-cyan-500",
};

const quickLinks = [
  { label: "Add Project", href: "/admin/projects", icon: "＋", color: "bg-violet-600 hover:bg-violet-500" },
  { label: "Add Testimonial", href: "/admin/testimonials", icon: "＋", color: "bg-cyan-700 hover:bg-cyan-600" },
  { label: "View Queries", href: "/admin/contact-queries", icon: "→", color: "bg-emerald-700 hover:bg-emerald-600" },
];

export default function DashboardView() {
  const maxVal = Math.max(...monthlyData);

  return (
    <div className="space-y-6">

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white dark:bg-gray-950 border rounded-xl p-5 flex items-start gap-4 ${colorMap[s.color]}`}>
            <div className={`p-2.5 rounded-lg border ${colorMap[s.color]}`}>{s.icon}</div>
            <div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{s.label}</p>
              <p className={`text-xs mt-1 ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                {s.up ? "▲" : "▼"} {s.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Bar chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Site Visits</h2>
              <p className="text-xs text-gray-500 mt-0.5">Monthly overview — 2024</p>
            </div>
            <span className="text-xs bg-violet-900/40 text-violet-400 border border-violet-800 px-3 py-1 rounded-full">This Year</span>
          </div>
          <div className="flex items-end gap-2 h-40">
            {monthlyData.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="relative w-full">
                  <div
                    className="w-full bg-violet-600 rounded-t-sm hover:bg-violet-400 transition-all duration-300 cursor-pointer"
                    style={{ height: `${(val / maxVal) * 130}px` }}
                  />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-violet-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">{val}k</span>
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-600">{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-2">Quick Actions</h2>
          {quickLinks.map((q) => (
            <Link key={q.label} href={q.href}
              className={`${q.color} text-white px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between transition-colors`}>
              {q.label}
              <span className="text-lg leading-none">{q.icon}</span>
            </Link>
          ))}

          {/* Donut-style breakdown */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 mb-3">Content Breakdown</p>
            {[["Projects", 12, "bg-violet-500"], ["Testimonials", 9, "bg-cyan-500"], ["Queries", 24, "bg-emerald-500"]].map(([label, val, color]) => (
              <div key={label as string} className="mb-2">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>{label}</span><span>{val}</span>
                </div>
                <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className={`h-full ${color} rounded-full`} style={{ width: `${Math.min(100, (Number(val) / 24) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColor[a.type]}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {a.action} <span className="text-gray-900 dark:text-white font-medium">{a.subject}</span>
                </p>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-600 flex-shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
