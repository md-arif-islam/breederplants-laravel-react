import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useStore = create((set, get) => ({
    authUser: null,
    isLoggingIn: false,
    isLoggingOut: false,
    isLoading: false,
    isCheckingAuth: true,
    growers: [],
    currentPage: 1,
    totalPages: 1,
    currentGrower: null,
    breeders: [],
    currentBreeder: null,
    varietyReports: [],
    currentVarietyReport: null,

    // all growers
    getAllGrowers: async (page = 1, searchQuery = "") => {
        set({ isLoading: true });
        try {
            // Pass search query to the endpoint
            const res = await axiosInstance.get(
                `/api/admin/growers?page=${page}&search=${searchQuery}`
            );
            set({
                growers: res.data.data,
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            });
        } catch (error) {
            // Handle if there's no `error.response.data.message`
            const message =
                error?.response?.data?.message || "Error fetching growers";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    // Get single grower
    getGrower: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/api/admin/growers/${id}`);
            set({ currentGrower: res.data });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching grower details";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getAllBreeders: async (page = 1, searchQuery = "") => {
        set({ isLoading: true });
        try {
            // Pass search query to the endpoint
            const res = await axiosInstance.get(
                `/api/admin/breeders?page=${page}&search=${searchQuery}`
            );
            set({
                breeders: res.data.data,
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            });
        } catch (error) {
            // Handle if there's no `error.response.data.message`
            const message =
                error?.response?.data?.message || "Error fetching breeders";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    // Get single grower
    getBreeder: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/api/admin/breeders/${id}`);
            set({ currentBreeder: res.data });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching breeder details";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },
}));
