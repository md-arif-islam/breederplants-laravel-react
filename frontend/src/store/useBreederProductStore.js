import { toast } from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useBreederProductStore = create((set, get) => ({
    isLoading: false,
    breederProducts: null,
    currentPage: 1,
    totalPages: 1,
    currentBreederProduct: null,
    breeders: [],

    getAllBreederProducts: async (
        page = 1,
        searchQuery = "",
        breederId = ""
    ) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/admin/breeders/${breederId}/products?page=${page}&search=${searchQuery}`
            );
            set({
                breederProducts: res.data.data,
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching breeder products";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getBreederProduct: async (breederId, id) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(
                `/api/admin/breeders/${breederId}/products/${id}`
            );
            set({ currentBreederProduct: response.data });
            set({ breeders: response.data.breeders });
            return response.data;
        } catch (error) {
            toast.error("Failed to fetch breeder product");
        } finally {
            set({ isLoading: false });
        }
    },

    createBreederProduct: async (breederId, data) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post(
                `/api/admin/breeders/${breederId}/products`,
                data
            );
            toast.success(response.data.message);
            return response;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error creating breeder product";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteBreederProduct: async (breederId, id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.delete(
                `/api/admin/breeders/${breederId}/products/${id}`
            );
            toast.success(res.data.message);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error deleting breeder product";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));
