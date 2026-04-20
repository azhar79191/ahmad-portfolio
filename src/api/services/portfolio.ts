import api from "../axiosInstance"
import { API_ENDPOINTS } from "../endpoints"

export const GetProjects=async()=>{
    const res=await api.get(API_ENDPOINTS.PROJECTS.GET_PROJECTS)
    return res.data;
}