import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useDashboardStore = create((set, get) => ({
  isLoading: false,
  dashboardStats: null,

  getDashboardStats: async () => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get("api/admin/dashboard");
      set({ dashboardStats: response.data });
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
      console.error(error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
