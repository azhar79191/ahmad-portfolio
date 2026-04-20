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
  search: string;
  filterStatus: string;
  setSearch: (v: string) => void;
  setFilterStatus: (v: string) => void;
  setTestimonials: (t: Testimonial[]) => void;
  addTestimonial: (t: Omit<Testimonial, "id">) => void;
  updateTestimonial: (id: number, t: Omit<Testimonial, "id">) => void;
  deleteTestimonial: (id: number) => void;
  toggleStatus: (id: number) => void;
};

const initialTestimonials: Testimonial[] = [
  { id: 1, name: "Sarah Johnson", role: "CEO", company: "TechStart", rating: 5, text: "Muhammad delivered an outstanding website that exceeded our expectations. His attention to detail and communication were top-notch.", status: "Published" },
  { id: 2, name: "Ali Hassan", role: "Product Manager", company: "DevCo", rating: 5, text: "Incredibly talented developer. He built our entire platform from scratch and delivered on time. Highly recommended!", status: "Published" },
  { id: 3, name: "Emily Clarke", role: "Founder", company: "DesignHub", rating: 5, text: "Working with Ahmad was a pleasure. Clean code, great design sense, and always responsive to feedback.", status: "Published" },
  { id: 4, name: "James Wilson", role: "CTO", company: "StartupXYZ", rating: 5, text: "Ahmad's technical skills are impressive. He tackled complex backend challenges with ease and delivered a scalable solution.", status: "Published" },
  { id: 5, name: "Fatima Malik", role: "Marketing Director", company: "BrandCo", rating: 5, text: "The landing page Ahmad built for us increased our conversion rate by 40%. His understanding of UX is outstanding.", status: "Published" },
  { id: 6, name: "David Chen", role: "Engineering Lead", company: "FinTech Inc", rating: 5, text: "Exceptional full-stack developer. Ahmad integrated our payment system flawlessly.", status: "Hidden" },
  { id: 7, name: "Aisha Raza", role: "CEO", company: "EduPlatform", rating: 5, text: "Our LMS was built by Ahmad and it's been running flawlessly for over a year.", status: "Published" },
  { id: 8, name: "Michael Torres", role: "Freelance Designer", company: "Self-employed", rating: 5, text: "I've collaborated with Ahmad on multiple client projects. He's my go-to developer.", status: "Published" },
  { id: 9, name: "Zara Ahmed", role: "Product Owner", company: "RetailTech", rating: 5, text: "Ahmad rebuilt our entire e-commerce platform in record time. Sales increased by 60% since launch.", status: "Hidden" },
];

export const useTestimonialStore = create<TestimonialStore>((set) => ({
  testimonials: [],
  search: "",
  filterStatus: "All",
  setSearch: (v) => set({ search: v }),
  setFilterStatus: (v) => set({ filterStatus: v }),
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
