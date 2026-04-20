"use client";

import { useState, useEffect } from "react";
import { useServiceStore, type Service } from "@/src/store/useServiceStore";
import { GetServices, PostService, PatchService, DeleteService } from "@/src/api/services/services";

export const gradientClasses: Record<string, string> = {
  violet_purple: "from-violet-600 to-purple-700",
  blue_indigo:   "from-blue-600 to-indigo-700",
  pink_rose:     "from-pink-600 to-rose-700",
  emerald_teal:  "from-emerald-600 to-teal-700",
  amber_orange:  "from-amber-600 to-orange-700",
  cyan_sky:      "from-cyan-600 to-sky-700",
};

type ServiceForm = {
  title: string;
  description: string;
  featuresInput: string;
  gradientKey: string;
};

const EMPTY_FORM: ServiceForm = {
  title: "",
  description: "",
  featuresInput: "",
  gradientKey: "violet_purple",
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-violet-600" : "bg-gray-600"}`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
    </button>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ServiceFormFields({
  form,
  onChange,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  form: ServiceForm;
  onChange: (f: ServiceForm) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const field =
    "bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500 w-full";
  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Title</label>
        <input className={field} value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} placeholder="Service title" />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Subtitle</label>
        <input className={field} value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} placeholder="Short description" />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Features (comma separated)</label>
        <input className={field} value={form.featuresInput} onChange={(e) => onChange({ ...form, featuresInput: e.target.value })} placeholder="Feature 1, Feature 2" />
      </div>
      <div>
        <label className="text-xs text-gray-400 uppercase tracking-wider block mb-1">Gradient</label>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(gradientClasses).map(([key, cls]) => (
            <button
              key={key}
              type="button"
              onClick={() => onChange({ ...form, gradientKey: key })}
              className={`w-8 h-8 rounded-full bg-gradient-to-br ${cls} transition-transform hover:scale-110 ${
                form.gradientKey === key ? "ring-2 ring-white ring-offset-2 ring-offset-gray-950 scale-110" : ""
              }`}
              title={key.replace("_", " ")}
            />
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onSubmit}
          disabled={!form.title || !form.description}
          className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          {submitLabel}
        </button>
        <button onClick={onCancel} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function AdminServicesView() {
  const { services, search, setSearch, setServices, addService, updateService, deleteService, toggleVisible } = useServiceStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<"add" | "edit" | "delete" | null>(null);
  const [selected, setSelected] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(EMPTY_FORM);

  useEffect(() => {
    GetServices()
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data?.results) ? data.results : [];
        setServices(list);
      })
      .catch((err) => {
        console.error(err);
        setError(err?.response?.data?.detail ?? err?.message ?? "Failed to load services");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal("add");
  };

  const openEdit = (s: Service) => {
    setSelected(s);
    setForm({ title: s.title, description: s.description, featuresInput: Array.isArray(s.features) ? s.features.join(", ") : s.features, gradientKey: s.gradient_from in gradientClasses ? s.gradient_from : "violet_purple" });
    setModal("edit");
  };

  const openDelete = (s: Service) => {
    setSelected(s);
    setModal("delete");
  };

  const buildPayload = (f: ServiceForm) => ({
    title: f.title,
    description: f.description,
    features: f.featuresInput.trim(),
    gradient_from: f.gradientKey,
    gradient_to: "",
  });

  const handleAdd = async () => {
    const created = await PostService({ ...buildPayload(form), visible: true }).catch(console.error);
    if (created) addService(created);
    setModal(null);
  };

  const handleEdit = async () => {
    if (!selected) return;
    await PatchService(selected.id, buildPayload(form)).catch(console.error);
    updateService(selected.id, { title: form.title, description: form.description, features: form.featuresInput.trim(), gradient_from: form.gradientKey, gradient_to: "" });
    setModal(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    await DeleteService(selected.id).catch(console.error);
    deleteService(selected.id);
    setModal(null);
  };

  const handleToggleVisible = async (s: Service) => {
    toggleVisible(s.id);
    await PatchService(s.id, { visible: !s.visible }).catch(() => toggleVisible(s.id));
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search services..."
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-violet-500 w-64"
        />
        <button
          onClick={openAdd}
          className="ml-auto flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </button>
      </div>

      {loading && <p className="text-center text-gray-500 py-6">Loading services...</p>}
      {error && <p className="text-center text-red-400 py-3 text-sm">{error}</p>}

      {/* Table */}
      <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Service</th>
                <th className="text-left px-5 py-3">Features</th>
                <th className="text-left px-5 py-3">Gradient</th>
                <th className="text-left px-5 py-3">Visible</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/60">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-600">
                    No services found
                  </td>
                </tr>
              )}
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-gray-900/50 transition-colors">
                  {/* Service */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex-shrink-0 bg-gradient-to-br ${gradientClasses[s.gradient_from] ?? "from-violet-600 to-purple-700"}`}
                      />
                      <div>
                        <p className="font-medium text-white">{s.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.description}</p>
                      </div>
                    </div>
                  </td>
                  {/* Features */}
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(s.features) ? s.features : s.features.toString().split(",").map((f) => f.trim()).filter(Boolean)).slice(0, 2).map((f) => (
                        <span key={f} className="text-xs bg-violet-950/60 text-violet-300 px-2 py-0.5 rounded border border-violet-800/50">
                          {f}
                        </span>
                      ))}
                      {(Array.isArray(s.features) ? s.features : s.features.toString().split(",").map((f) => f.trim()).filter(Boolean)).length > 2 && (
                        <span className="text-xs text-gray-400">+{(Array.isArray(s.features) ? s.features : s.features.toString().split(",").map((f) => f.trim()).filter(Boolean)).length - 2}</span>
                      )}
                    </div>
                  </td>
                  {/* Gradient preview */}
                  <td className="px-5 py-4">
                    <div className={`w-16 h-5 rounded-full bg-gradient-to-r ${gradientClasses[s.gradient_from] ?? "from-violet-600 to-purple-700"}`} />
                  </td>
                  {/* Visible toggle */}
                  <td className="px-5 py-4">
                    <Toggle checked={s.visible} onChange={() => handleToggleVisible(s)} />
                  </td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(s)}
                        title="Edit"
                        className="p-1.5 text-gray-500 hover:text-violet-400 hover:bg-gray-800 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => openDelete(s)}
                        title="Delete"
                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-gray-800 rounded transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-gray-800 text-xs text-gray-600">
          Showing {filtered.length} of {services.length} services
        </div>
      </div>

      {/* Add Modal */}
      {modal === "add" && (
        <Modal title="Add Service" onClose={() => setModal(null)}>
          <ServiceFormFields form={form} onChange={setForm} onSubmit={handleAdd} onCancel={() => setModal(null)} submitLabel="Add Service" />
        </Modal>
      )}

      {/* Edit Modal */}
      {modal === "edit" && selected && (
        <Modal title="Edit Service" onClose={() => setModal(null)}>
          <ServiceFormFields form={form} onChange={setForm} onSubmit={handleEdit} onCancel={() => setModal(null)} submitLabel="Save Changes" />
        </Modal>
      )}

      {/* Delete Modal */}
      {modal === "delete" && selected && (
        <Modal title="Delete Service" onClose={() => setModal(null)}>
          <div className="text-center">
            <div className="w-14 h-14 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <p className="text-gray-300 text-sm mb-6">
              Delete <span className="text-white font-semibold">{selected.title}</span>? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
                Delete
              </button>
              <button onClick={() => setModal(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2.5 rounded-lg text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
