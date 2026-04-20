import api from "../axiosInstance"
import { API_ENDPOINTS } from "../endpoints"

export const GetTestimonials = async () => {
  const res = await api.get(API_ENDPOINTS.TESTEMONIAL.GET_TESTIMONIAL);
  return res.data;
}

export const PostTestimonial = async (name: string, company: string, role: string, status: string, rating: number, review_text: string) => {
  const res = await api.post(API_ENDPOINTS.TESTEMONIAL.POST_TESTIMONIAL, { name, company, role, status, rating, review_text });
  return res.data;
}

export const PatchTestimonial = async (id: number, data: { name?: string; company?: string; role?: string; status?: string; rating?: number; review_text?: string }) => {
  const res = await api.patch(API_ENDPOINTS.TESTEMONIAL.PATCH_BYID(id), data);
  return res.data;
}

export const DeleteTestimonial = async (id: number) => {
  const res = await api.delete(API_ENDPOINTS.TESTEMONIAL.DELETE_TESTIMONIAL(id));
  return res.data;
}