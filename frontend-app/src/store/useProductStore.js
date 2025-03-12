import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProductStore = create((set, get) => ({
    isLoading: false,
    products: null,
    currentPage: 1,
    totalPages: 1,
    currentProduct: null,

    getAllProducts: async (page = 1, searchQuery = "") => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/public/products?page=${page}&search=${searchQuery}`
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
                `api/public/products/${id}`
            );
            set({ currentProduct: response.data.product });
            set({ breeders: response.data.breeders });
            return response.data;
        } catch (error) {
            toast.error("Failed to fetch product");
            console.log(error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
