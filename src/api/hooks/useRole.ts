import { useUserStore } from "@/src/store/useUserStore";

export function useRole() {
  const role = useUserStore((state) => state.user?.role);
  const isSuperAdmin = role === "super_admin";
  return { role, isSuperAdmin };
}
