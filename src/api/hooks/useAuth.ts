import { useUserStore } from "@/src/store/useUserStore";
import { login, logout } from "../services/auth";
import { toast } from "react-toastify";

export default function useAuth() {
  const setUser = useUserStore((state) => state.setUser)

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await login(email, password)
      document.cookie = `token=${response.access}; path=/; samesite=lax`;
      document.cookie = `refresh=${response.refresh}; path=/; samesite=lax`;
      document.cookie = `role=${response.user.role}; path=/; samesite=lax`;
      setUser(response.user)
      return true

    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed")
      return false;
    }
  }

  const logoutUser = () => {
    logout();
  }

  return {
    loginUser,
    logoutUser
  }
}