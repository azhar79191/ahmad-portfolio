"use client";

import { useState, useEffect } from "react";
import { GetUsers, SendRoles, UpdateUser, DeleteUser, RevokeAccess } from "@/src/api/services/roles";

type Role = "content_creator" | "support_staff";
type Status = "Active" | "Revoked";

type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: Status;
  added: string;
};

const ROLE_COLORS: Record<Role, string> = {
  "content_creator": "border-purple-500 text-purple-300",
  "support_staff":   "border-blue-500 text-blue-300",
};

const ROLE_LABELS: Record<Role, string> = {
  "content_creator": "Content Creator",
  "support_staff":   "Support Staff",
};

const ROLES: Role[] = ["content_creator", "support_staff"];

type UserForm = Omit<User, "id" | "added">;

const EMPTY_FORM: UserForm = { name: "", email: "", role: "content_creator", status: "Active" };

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function UserFormFields({ form, onChange, onSubmit, onCancel, submitLabel }: {
  form: UserForm;
  onChange: (f: UserForm) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const field = "bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500 w-full";
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Name</label>
        <input className={field} value={form.name} onChange={e => onChange({ ...form, name: e.target.value })} placeholder="Full name" />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Email</label>
        <input className={field} type="email" value={form.email} onChange={e => onChange({ ...form, email: e.target.value })} placeholder="email@example.com" />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Role</label>
        <select className={field} value={form.role} onChange={e => onChange({ ...form, role: e.target.value as Role })}>
          {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
        </select>
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Status</label>
        <select className={field} value={form.status} onChange={e => onChange({ ...form, status: e.target.value as Status })}>
          <option>Active</option>
          <option>Revoked</option>
        </select>
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={onSubmit} disabled={!form.name || !form.email}
          className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
          {submitLabel}
        </button>
        <button onClick={onCancel} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm transition-colors">Cancel</button>
      </div>
    </div>
  );
}

function normalize(raw: any): User {
  return {
    id: raw.id ?? Date.now(),
    name: raw.name ?? raw.username ?? raw.full_name ?? "",
    email: raw.email ?? "",
    role: (raw.role ?? raw.user_role ?? "Support Staff") as Role,
    status: (raw.status ?? (raw.is_active === false ? "Revoked" : "Active")) as Status,
    added: raw.date_joined ?? raw.created_at
      ? new Date(raw.date_joined ?? raw.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
      : new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }),
  };
}

export default function RoleManagementView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("All Roles");
  const [filterStatus, setFilterStatus] = useState("All Status");

  useEffect(() => {
    GetUsers()
      .then((data) => {
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setUsers(list.map(normalize));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);
  const [modal, setModal] = useState<"add" | "edit" | "view" | "delete" | null>(null);
  const [selected, setSelected] = useState<User | null>(null);
  const [form, setForm] = useState<UserForm>(EMPTY_FORM);

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "All Roles" || u.role === filterRole;
    const matchStatus = filterStatus === "All Status" || u.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });

  const openAdd = () => { setForm(EMPTY_FORM); setModal("add"); };
  const openEdit = (u: User) => { setSelected(u); setForm({ name: u.name, email: u.email, role: u.role, status: u.status }); setModal("edit"); };
  const openView = (u: User) => { setSelected(u); setModal("view"); };
  const openDelete = (u: User) => { setSelected(u); setModal("delete"); };

  const handleAdd = async () => {
    await SendRoles({ name: form.name, email: form.email, role: form.role }).catch(console.error);
    setUsers(prev => [...prev, { ...form, id: Date.now(), added: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) }]);
    setModal(null);
  };

  const handleEdit = async () => {
    if (!selected) return;
    await UpdateUser(selected.id, { name: form.name, email: form.email, role: form.role }).catch(console.error);
    setUsers(prev => prev.map(u => u.id === selected.id ? { ...u, ...form } : u));
    setModal(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    await DeleteUser(selected.id).catch(console.error);
    setUsers(prev => prev.filter(u => u.id !== selected.id));
    setModal(null);
  };

  const toggleStatus = async (id: number) => {
    if (!users.find(u => u.id === id)) return;
    const res = await RevokeAccess(id).catch(console.error);
    if (res) {
      const newStatus: Status = res.is_active === false ? "Revoked" : "Active";
      setUsers(prev => prev.map(u => u.id === id ? { ...u, status: newStatus } : u));
    }
  };

  const select = "bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-violet-500";

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..."
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500 w-64" />
        <select value={filterRole} onChange={e => setFilterRole(e.target.value)} className={select}>
          <option>All Roles</option>
          {ROLES.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={select}>
          <option>All Status</option>
          <option>Active</option>
          <option>Revoked</option>
        </select>
        <button onClick={openAdd} className="ml-auto flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add User
        </button>
      </div>

      {loading && <p className="text-center text-gray-500 py-6">Loading users...</p>}

      {/* Table */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Name</th>
                <th className="text-left px-5 py-3">Email</th>
                <th className="text-left px-5 py-3">Role</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-left px-5 py-3">Added</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-600">No users found</td></tr>
              )}
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-gray-900/50 transition-colors">
                  <td className="px-5 py-4 font-medium text-white">{u.name}</td>
                  <td className="px-5 py-4 text-gray-400">{u.email}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-3 py-1 rounded-full border ${ROLE_COLORS[u.role]}`}>{ROLE_LABELS[u.role] ?? u.role}</span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleStatus(u.id)}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors ${u.status === "Active" ? "bg-emerald-900/40 text-emerald-400 border-emerald-800 hover:bg-emerald-900/70" : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700"}`}>
                      {u.status}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-gray-400">{u.added}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openView(u)} title="View" className="p-1.5 text-gray-500 hover:text-cyan-400 hover:bg-gray-800 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => openEdit(u)} title="Edit" className="p-1.5 text-gray-500 hover:text-violet-400 hover:bg-gray-800 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => toggleStatus(u.id)} title="Toggle Status" className="p-1.5 text-gray-500 hover:text-amber-400 hover:bg-gray-800 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>
                      </button>
                      <button onClick={() => openDelete(u)} title="Delete" className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-600">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>

      {/* Add Modal */}
      {modal === "add" && (
        <Modal title="Add User" onClose={() => setModal(null)}>
          <UserFormFields form={form} onChange={setForm} onSubmit={handleAdd} onCancel={() => setModal(null)} submitLabel="Add User" />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === "edit" && selected && (
        <Modal title="Edit User" onClose={() => setModal(null)}>
          <UserFormFields form={form} onChange={setForm} onSubmit={handleEdit} onCancel={() => setModal(null)} submitLabel="Save Changes" />
        </Modal>
      )}

      {/* View Modal */}
      {modal === "view" && selected && (
        <Modal title="User Details" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-violet-600 flex items-center justify-center text-white font-bold text-lg">
                {selected.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-white text-base">{selected.name}</p>
                <p className="text-gray-400 text-sm">{selected.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Role</p>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${ROLE_COLORS[selected.role]}`}>{ROLE_LABELS[selected.role] ?? selected.role}</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Status</p>
                <span className={`text-xs px-2.5 py-1 rounded-full border ${selected.status === "Active" ? "bg-emerald-900/40 text-emerald-400 border-emerald-800" : "bg-gray-700 text-gray-400 border-gray-600"}`}>{selected.status}</span>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 col-span-2">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Added</p>
                <p className="text-gray-200">{selected.added}</p>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button onClick={() => openEdit(selected)} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">Edit</button>
              <button onClick={() => setModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 rounded-lg text-sm transition-colors">Close</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {modal === "delete" && selected && (
        <Modal title="Delete User" onClose={() => setModal(null)}>
          <div className="text-center">
            <div className="w-14 h-14 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <p className="text-gray-300 text-sm mb-6">Remove <span className="text-white font-semibold">{selected.email}</span> from the system? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">Delete</button>
              <button onClick={() => setModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm transition-colors">Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
