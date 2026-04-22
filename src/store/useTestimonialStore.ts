import { create } from "zustand";

export type Testimonial = {
  id: number;
  name: string;
  role: string;
  company: string;
  rating: number;
  text: string;
  status: "Published" | "Hidden";
};

type TestimonialStore = {
  testimonials: Testimonial[];
  setTestimonials: (t: Testimonial[]) => void;
  addTestimonial: (t: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: number, t: Omit<Testimonial, "id">) => void;
  deleteTestimonial: (id: number) => void;
  toggleStatus: (id: number) => void;
};

export const useTestimonialStore = create<TestimonialStore>((set) => ({
  testimonials: [],
  setTestimonials: (t) => set({ testimonials: t }),
  addTestimonial: (t) =>
    set((s) => ({ testimonials: [...s.testimonials, { ...t, id: Date.now() }] })),
  updateTestimonial: (id, t) =>
    set((s) => ({ testimonials: s.testimonials.map((x) => (x.id === id ? { ...t, id } : x)) })),
  deleteTestimonial: (id) =>
    set((s) => ({ testimonials: s.testimonials.filter((x) => x.id !== id) })),
  toggleStatus: (id) =>
    set((s) => ({
      testimonials: s.testimonials.map((x) =>
        x.id === id ? { ...x, status: x.status === "Published" ? "Hidden" : "Published" } : x
      ),
    })),
}));
