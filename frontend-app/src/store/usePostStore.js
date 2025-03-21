import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const usePostStore = create((set) => ({
    isLoading: false,
    posts: [],
    currentPost: null,
    currentPage: 1,
    totalPages: 1,
    categories: [],
    tags: [],

    getAllPosts: async (
        page = 1,
        searchQuery = "",
        category = "",
        tag = "",
        sort = ""
    ) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/public/posts?page=${page}&search=${searchQuery}&category=${category}&tags=${tag}&sort=${sort}`
            );
            set({
                posts: res.data.data,
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            }); // Assuming posts are in res.data.data
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error fetching posts";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getPost: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/api/public/posts/${id}`);
            set({ currentPost: res.data });
            return res.data;
        } catch (error) {
            toast.error("Failed to fetch post");
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    // New method for related posts
    getRelatedPosts: async (tag) => {
        try {
            const res = await axiosInstance.get(
                `/api/public/posts?tags=${tag}`
            );
            return res.data.data;
        } catch (error) {
            toast.error("Failed to fetch related posts");
            return [];
        }
    },

    // New: Get posts by category
    getPostsByCategory: async (slug, page = 1) => {
        try {
            const res = await axiosInstance.get(
                `/api/public/posts?category=${slug}&page=${page}`
            );
            set({
                posts: res.data.data,
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            }); // Assuming posts are in res.data.data
            return res.data; // Return the full response including categoryName
        } catch (error) {
            toast.error("Failed to fetch posts by category");
            return [];
        }
    },

    // New: Get posts by tag
    getPostsByTag: async (slug, page = 1) => {
        try {
            const res = await axiosInstance.get(
                `/api/public/posts?tags=${slug}&page=${page}`
            );
            set({
                posts: res.data.data,
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            }); // Assuming posts are in res.data.data
            return res.data;
        } catch (error) {
            toast.error("Failed to fetch posts by tag");
            return [];
        }
    },
}));
