import { create } from "zustand";

export type Service = {
  id: number;
  title: string;
  description: string;
  features: string[] | string;
  gradient_from: string;
  gradient_to: string;
  visible: boolean;
};

type ServiceStore = {
  services: Service[];
  search: string;
  setSearch: (v: string) => void;
  setServices: (s: Service[]) => void;
  addService: (s: Omit<Service, "id">) => void;
  updateService: (id: number, s: Partial<Service>) => void;
  deleteService: (id: number) => void;
  toggleVisible: (id: number) => void;
};

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  search: "",
  setSearch: (v) => set({ search: v }),
  setServices: (s) => set({ services: s }),
  addService: (s) => set((st) => ({ services: [...st.services, { ...s, id: Date.now() }] })),
  updateService: (id, s) => set((st) => ({ services: st.services.map((x) => (x.id === id ? { ...x, ...s } : x)) })),
  deleteService: (id) => set((st) => ({ services: st.services.filter((x) => x.id !== id) })),
  toggleVisible: (id) => set((st) => ({ services: st.services.map((x) => (x.id === id ? { ...x, visible: !x.visible } : x)) })),
}));
