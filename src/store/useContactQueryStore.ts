import { create } from "zustand";
import { fetchAllQueries, patchQuery, removeQuery, markAllRead as markAllReadApi, markReadById } from "@/src/api/services/queries";

export type ContactQuery = {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
  read: boolean;
};

type ContactQueryStore = {
  queries: ContactQuery[];
  loading: boolean;
  error: string | null;
  search: string;
  filterRead: string;
  setSearch: (v: string) => void;
  setFilterRead: (v: string) => void;
  fetchQueries: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  toggleRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteQuery: (id: number) => Promise<void>;
};

export const useContactQueryStore = create<ContactQueryStore>((set, get) => ({
  queries: [],
  loading: false,
  error: null,
  search: "",
  filterRead: "All",

  setSearch: (v) => set({ search: v }),
  setFilterRead: (v) => set({ filterRead: v }),

  fetchQueries: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchAllQueries();
      set({ queries: Array.isArray(data) ? data : (data.results ?? []) });
    } catch {
      set({ error: "Failed to load queries." });
    } finally {
      set({ loading: false });
    }
  },

  markRead: async (id) => {
    set((s) => ({ queries: s.queries.map((q) => (q.id === id ? { ...q, read: true } : q)) }));
    try {
      const updated = await markReadById(id);
      set((s) => ({ queries: s.queries.map((q) => (q.id === id ? { ...q, ...updated } : q)) }));
    } catch {
      set((s) => ({ queries: s.queries.map((q) => (q.id === id ? { ...q, read: false } : q)) }));
    }
  },

  toggleRead: async (id) => {
    const query = get().queries.find((q) => q.id === id);
    if (!query) return;
    const newRead = !query.read;
    set((s) => ({ queries: s.queries.map((q) => (q.id === id ? { ...q, read: newRead } : q)) }));
    try {
      const updated = newRead ? await markReadById(id) : await patchQuery(id, { read: false });
      set((s) => ({ queries: s.queries.map((q) => (q.id === id ? { ...q, ...updated } : q)) }));
    } catch {
      set((s) => ({ queries: s.queries.map((q) => (q.id === id ? { ...q, read: !newRead } : q)) }));
    }
  },

  markAllRead: async () => {
    set((s) => ({ queries: s.queries.map((q) => ({ ...q, read: true })) }));
    try {
      await markAllReadApi();
      await get().fetchQueries();
    } catch {
      set((s) => ({ queries: s.queries.map((q) => ({ ...q, read: false })) }));
    }
  },

  deleteQuery: async (id) => {
    await removeQuery(id);
    set((s) => ({ queries: s.queries.filter((q) => q.id !== id) }));
  },
}));
