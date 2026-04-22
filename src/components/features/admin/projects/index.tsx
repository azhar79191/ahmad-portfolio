"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import FormField from "@/src/components/shared/FormField";
import ImageDropZone from "@/src/components/shared/ImageDropZone";
import { useProjectStore, type Project } from "@/src/store/useProjectStore";
import { GetProjects, PostProject, PatchProject, DeleteProject, SearchProjects } from "@/src/api/services/projects";
import { useRole } from "@/src/api/hooks/useRole";

type ProjectForm = Omit<Project, "id">;

const STATUS_DISPLAY: Record<string, string> = {
  live: "Live",
  "in progress": "In Progress",
  archived: "Archived",
};

const statusStyle: Record<string, string> = {
  live: "bg-emerald-900/40 text-emerald-400 border-emerald-800",
  "in progress": "bg-amber-900/40 text-amber-400 border-amber-800",
  archived: "bg-gray-800 text-gray-500 border-gray-700",
};

const rules = {
  title:       { required: "Title is required" },
  description: { required: "Description is required" },
  github_url:  { required: "GitHub URL is required", pattern: { value: /^https?:\/\/.+/, message: "Enter a valid URL" } },
  live_url:    { required: "Live URL is required" },
  tech_stack:  { required: "At least one technology is required" },
  year:        { required: "Year is required", pattern: { value: /^\d{4}$/, message: "Enter a valid 4-digit year" } },
  category:    { required: "Category is required" },
  status:      { required: "Status is required" },
};

function ProjectFormModal({ defaultValues, onSave, onCancel, submitLabel }: {
  defaultValues: ProjectForm;
  onSave: (data: ProjectForm) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const { control, handleSubmit, setValue, formState: { errors, isValid, isDirty } } = useForm<ProjectForm>({ defaultValues, mode: "onChange" });

  return (
    <form onSubmit={handleSubmit(onSave)} noValidate className="space-y-3">
      <Controller control={control} name="title" rules={rules.title}
        render={({ field }) => <FormField label="Title" value={field.value} onChange={field.onChange} error={errors.title?.message} />} />
      <Controller control={control} name="github_url" rules={rules.github_url}
        render={({ field }) => <FormField label="GitHub URL" value={field.value} onChange={field.onChange} error={errors.github_url?.message} />} />
      <Controller control={control} name="live_url" rules={rules.live_url}
        render={({ field }) => <FormField label="Live URL" value={field.value} onChange={field.onChange} error={errors.live_url?.message} />} />
      <Controller control={control} name="description" rules={rules.description}
        render={({ field }) => <FormField as="textarea" label="Description" rows={2} value={field.value} onChange={field.onChange} error={errors.description?.message} />} />
      <div className="grid grid-cols-2 gap-3">
        <Controller control={control} name="category" rules={rules.category}
          render={({ field }) => <FormField as="select" label="Category" value={field.value} onChange={field.onChange} error={errors.category?.message}
            options={["Full-Stack", "Frontend", "Backend"].map(c => ({ label: c, value: c }))} />} />
        <Controller control={control} name="status" rules={rules.status}
          render={({ field }) => <FormField as="select" label="Status" value={field.value} onChange={field.onChange} error={errors.status?.message}
            options={[
              { label: "Live", value: "live" },
              { label: "In Progress", value: "in progress" },
              { label: "Archived", value: "archived" },
            ]} />} />
      </div>
      <Controller control={control} name="tech_stack" rules={rules.tech_stack}
        render={({ field }) => <FormField label="Tech Stack (comma separated)" placeholder="NextJS, Django, PostgreSQL" value={field.value} onChange={field.onChange} error={errors.tech_stack?.message} />} />
      <Controller control={control} name="year" rules={rules.year}
        render={({ field }) => <FormField label="Year" placeholder="2024" value={field.value} onChange={field.onChange} error={errors.year?.message} />} />
      <Controller control={control} name="image"
        render={({ field }) => (
          <ImageDropZone
            value={field.value ?? ""}
            onChange={(base64) => setValue("image", base64, { shouldDirty: true, shouldValidate: true })}
            onClear={() => setValue("image", "", { shouldDirty: true, shouldValidate: true })}
          />
        )}
      />
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={!isValid || !isDirty}
          className="flex-1 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">
          {submitLabel}
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg text-sm transition-colors">Cancel</button>
      </div>
    </form>
  );
}

export default function AdminProjectsView() {
  const { projects, search, filterStatus, setSearch, setFilterStatus, addProject, updateProject, deleteProject, setProjects } = useProjectStore();
  const [modal, setModal] = useState<"add" | "edit" | "view" | "delete" | null>(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const { isSuperAdmin } = useRole();

  useEffect(() => {
    const delay = search.trim() ? 400 : 0;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = search.trim()
          ? await SearchProjects(search)
          : await GetProjects(page, pageSize, filterStatus);
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setTotalCount(data.pagination?.total_count ?? list.length);
        setTotalPages(data.pagination?.total_pages ?? 1);
        setHasNext(data.pagination?.has_next ?? false);
        setHasPrev(data.pagination?.has_previous ?? false);
        setProjects(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [page, pageSize, search, filterStatus]);

  const openAdd    = () => { setSelected(null); setModal("add"); };
  const openEdit   = (p: Project) => { setSelected(p); setModal("edit"); };
  const openView   = (p: Project) => { setSelected(p); setModal("view"); };
  const openDelete = (p: Project) => { setSelected(p); setModal("delete"); };

  const handleSave = async (data: ProjectForm) => {
    if (modal === "add") {
      const created = await PostProject(data).catch(console.error);
      if (created) addProject(created);
    } else if (modal === "edit" && selected) {
      await PatchProject(selected.id, data).catch(console.error);
      updateProject(selected.id, data);
    }
    setModal(null);
  };

  const handleDelete = async () => {
    if (!selected) return;
    await DeleteProject(selected.id).catch(console.error);
    deleteProject(selected.id);
    setModal(null);
  };

  const emptyForm: ProjectForm = {
    title: "", category: "Full-Stack", tech_stack: "",
    status: "live", year: new Date().getFullYear().toString(),
    github_url: "", live_url: "", description: "", image: "",
  };

  const techList = (p: Project) =>
    p.tech_stack.split(",").map((t) => t.trim()).filter(Boolean);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 flex-1">
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search projects..."
            className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-violet-500 w-56" />
          <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }}
            className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:border-violet-500">
            <option value="All">All</option>
            <option value="live">Live</option>
            <option value="in progress">In Progress</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Add Project
        </button>
      </div>

      {loading && <p className="text-center text-gray-400 py-6">Loading projects...</p>}

      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3">Project</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Tech Stack</th>
                <th className="text-left px-5 py-3">Year</th>
                <th className="text-left px-5 py-3">Status</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
              {projects.length === 0 && !loading && (
                <tr><td colSpan={6} className="text-center py-12 text-gray-400 dark:text-gray-600">No projects found</td></tr>
              )}
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      {p.image && <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-200 dark:border-gray-700" />}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{p.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{p.category}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {techList(p).slice(0, 2).map((t, i) => (
                        <span key={`${t}-${i}`} className="text-xs bg-violet-950/60 text-violet-300 px-2 py-0.5 rounded border border-violet-800/50">{t}</span>
                      ))}
                      {techList(p).length > 2 && <span className="text-xs text-gray-400">+{techList(p).length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400">{p.year}</td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full border ${statusStyle[p.status] ?? statusStyle["live"]}`}>
                      {STATUS_DISPLAY[p.status] ?? p.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openView(p)} title="View" className="p-1.5 text-gray-400 hover:text-cyan-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </button>
                      <button onClick={() => openEdit(p)} title="Edit" className="p-1.5 text-gray-400 hover:text-violet-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      {isSuperAdmin && (
                        <button onClick={() => openDelete(p)} title="Delete" className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
            <span>Per page:</span>
            <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
              className="bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-xs text-gray-700 dark:text-gray-300 focus:outline-none">
              {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span>{totalCount} total</span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => p - 1)} disabled={!hasPrev}
              className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 text-xs transition-colors">
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded text-xs font-medium transition-colors ${page === p ? "bg-violet-600 text-white" : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage(p => p + 1)} disabled={!hasNext}
              className="px-3 py-1.5 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300 text-xs transition-colors">
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {modal === "view" && selected && (
              <div className="p-6">
                <div className="flex items-start justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selected.title}</h2>
                  <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <div className="space-y-3 text-sm">
                  {selected.image && <img src={selected.image} alt={selected.title} className="w-full h-40 object-cover rounded-xl mb-2" />}
                  {([
                    ["Category", selected.category],
                    ["Year", selected.year],
                    ["Tech", selected.tech_stack],
                    ["Description", selected.description],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label} className="flex gap-2"><span className="text-gray-500 w-24">{label}:</span><span className="text-gray-700 dark:text-gray-200">{val}</span></div>
                  ))}
                  <div className="flex gap-2"><span className="text-gray-500 w-24">Status:</span><span className={`text-xs px-2 py-0.5 rounded-full border ${statusStyle[selected.status]}`}>{STATUS_DISPLAY[selected.status] ?? selected.status}</span></div>
                  <div className="flex gap-2"><span className="text-gray-500 w-24">GitHub:</span><a href={selected.github_url} className="text-violet-400 hover:underline truncate">{selected.github_url}</a></div>
                  <div className="flex gap-2"><span className="text-gray-500 w-24">Live:</span><a href={selected.live_url} className="text-violet-400 hover:underline">{selected.live_url}</a></div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={() => openEdit(selected)} className="flex-1 bg-violet-600 hover:bg-violet-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">Edit</button>
                  <button onClick={() => setModal(null)} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2 rounded-lg text-sm transition-colors">Close</button>
                </div>
              </div>
            )}

            {(modal === "add" || modal === "edit") && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{modal === "add" ? "Add Project" : "Edit Project"}</h2>
                  <button onClick={() => setModal(null)} className="text-gray-400 hover:text-white"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <ProjectFormModal
                  defaultValues={selected ? { ...selected } : emptyForm}
                  onSave={handleSave}
                  onCancel={() => setModal(null)}
                  submitLabel={modal === "add" ? "Add Project" : "Save Changes"}
                />
              </div>
            )}

            {modal === "delete" && selected && (
              <div className="p-6 text-center">
                <div className="w-14 h-14 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete Project?</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Delete <span className="text-white font-medium">"{selected.title}"</span>? This cannot be undone.</p>
                <div className="flex gap-3">
                  <button onClick={handleDelete} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg text-sm font-semibold transition-colors">Delete</button>
                  <button onClick={() => setModal(null)} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-2.5 rounded-lg text-sm transition-colors">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
