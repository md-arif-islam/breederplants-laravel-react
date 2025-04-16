import { toast } from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

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

    checkAuth: async () => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            set({ authUser: user });
        } catch (error) {
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            await axiosInstance.get("/sanctum/csrf-cookie").then((response) => {
                //
            });
            const res = await axiosInstance.post("/api/login", data);
            set({ authUser: res.data });
            localStorage.setItem("user", JSON.stringify(res.data.user));
            localStorage.setItem("token", res.data.token);
            toast.success("Logged in successfully");

            return res.data.user;
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        set({ isLoggingOut: true });
        try {
            await axiosInstance.post("/api/logout");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingOut: false });
        }
    },

    sendResetEmail: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(
                "/api/send-reset-link-email",
                data
            );
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response.data.error);
        } finally {
            set({ isLoading: false });
        }
    },

    resetPassword: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post("/api/reset-password", data);
            toast.success(res.data.message);
            return res;
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoading: false });
        }
    },

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

    updateGrower: async (id, payload) => {
        try {
            const res = await axiosInstance.put(
                `/api/admin/growers/${id}`,
                payload
            );
            set({ currentGrower: res.data });
            toast.success("Grower updated successfully");
            return res;
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoading: false });
        }
    },

    deleteGrower: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.delete(`/api/admin/growers/${id}`);
            toast.success("Grower deleted successfully");
            return res;
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoading: false });
        }
    },

    updateGrowerPassword: async (id, payload) => {
        try {
            const res = await axiosInstance.put(
                `/api/admin/growers/${id}/update-password`,
                payload
            );
            toast.success("Grower password updated successfully");
            return res;
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoading: false });
        }
    },

    createGrower: async (payload) => {
        try {
            const res = await axiosInstance.post("/api/admin/growers", payload);
            toast.success("Grower created successfully");
            return res;
        } catch (error) {
            toast.error(error.response.data.message);
            const errors = error.response.data.errors;
            for (const key in errors) {
                toast.error(errors[key]);
            }
        } finally {
            set({ isLoading: false });
        }
    },

    // Breeders

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

    updateBreeder: async (id, payload) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.put(
                `/api/admin/breeders/${id}`,
                payload
            );
            set({ currentBreeder: res.data });
            toast.success("Breeder updated successfully");
            return res;
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoading: false });
        }
    },

    deleteBreeder: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.delete(`/api/admin/breeders/${id}`);
            toast.success("Breeder deleted successfully");
            return res;
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoading: false });
        }
    },

    updateBreederPassword: async (id, payload) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.put(
                `/api/admin/breeders/${id}/update-password`,
                payload
            );
            toast.success("Breeder password updated successfully");
            return res;
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoading: false });
        }
    },

    createBreeder: async (payload) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(
                "/api/admin/breeders",
                payload
            );
            toast.success("Breeder created successfully");
            return res;
        } catch (error) {
            toast.error(error.response.data.message);
            const errors = error.response.data.errors;
            for (const key in errors) {
                toast.error(errors[key]);
            }
        } finally {
            set({ isLoading: false });
        }
    },

    importCSVGrowers: async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosInstance.post(
                "/api/admin/growers/import",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success("Growers imported successfully!");
            return response;
        } catch (error) {
            console.error("Error importing CSV:", error);
            if (
                error.response &&
                error.response.data &&
                error.response.data.failedImports
            ) {
                error.response.data.failedImports.forEach((failedImport) => {
                    toast.error(
                        `Import failed for ${
                            failedImport.email || failedImport.username
                        }: ${failedImport.reason}`
                    );
                });
            } else {
                toast.error("Failed to import growers");
            }
            throw error;
        }
    },

    exportCSVGrowers: async () => {
        try {
            const response = await axiosInstance.get(
                "/api/admin/growers/export-csv",
                {
                    responseType: "blob", // Important for handling binary data
                }
            );

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `growers-data-${new Date().toISOString().slice(0, 10)}.csv`
            ); // Set filename
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("CSV export started successfully!");
        } catch (error) {
            console.error("Error exporting CSV:", error);
            toast.error(
                "Failed to export CSV. Please check the console for details."
            );
        }
    },

    importCSVBreeders: async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axiosInstance.post(
                "/api/admin/breeders/import",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            toast.success("Breeders imported successfully!");
            return response;
        } catch (error) {
            console.error("Error importing CSV:", error);
            toast.error(
                "Failed to import breeders. Please check the console for details."
            );
            throw error; // Re-throw to handle in component
        }
    },

    exportCSVBreeders: async () => {
        try {
            const response = await axiosInstance.get(
                "/api/admin/breeders/export-csv",
                {
                    responseType: "blob",
                }
            );

            // Create a download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `breeders-data-${new Date().toISOString().slice(0, 10)}.csv`
            ); // Set filename
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("CSV export started successfully!");
        } catch (error) {
            console.error("Error exporting CSV:", error);
            toast.error(
                "Failed to export CSV. Please check the console for details."
            );
        }
    },
}));
