import { toast } from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useProductStore = create((set, get) => ({
    isLoading: false,
    products: null,
    currentPage: 1,
    totalPages: 1,
    currentProduct: null,
    breeders: [],

    getAllProducts: async (page = 1, searchQuery = "") => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/admin/products?page=${page}&search=${searchQuery}`
            );
            set({
                products: res.data.data,
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error fetching products";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getProduct: async (id) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.get(
                `api/admin/products/${id}`
            );
            set({ currentProduct: response.data.product });
            set({ breeders: response.data.breeders });
            return response.data;
        } catch (error) {
            toast.error("Failed to fetch product");
        } finally {
            set({ isLoading: false });
        }
    },

    createProduct: async (data) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.post(
                `api/admin/products`,
                data
            );
            toast.success(response.data.message);
            return response;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error creating product";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updateProduct: async (id, data) => {
        set({ isLoading: true });
        try {
            const response = await axiosInstance.put(
                `api/admin/products/${id}`,
                data
            );
            toast.success(response.data.message);
            return response;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error updating product";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deleteProduct: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.delete(`api/admin/products/${id}`);
            toast.success(res.data.message);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error deleting product";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));
