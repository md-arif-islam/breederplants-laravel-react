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
                `/api/admin/posts?page=${page}&search=${searchQuery}&category=${category}&tags=${tag}&sort=${sort}`
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
            const res = await axiosInstance.get(`/api/admin/posts/${id}`);
            set({ currentPost: res.data });
            return res.data;
        } catch (error) {
            toast.error("Failed to fetch post");
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    createPost: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(`/api/admin/posts`, data);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error creating post";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    updatePost: async (id, data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.put(`/api/admin/posts/${id}`, data);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error updating post";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    deletePost: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.delete(`/api/admin/posts/${id}`);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error deleting post";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // CRUD for Categories
    getAllCategories: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/api/admin/posts/categories`);
            set({ categories: res.data });
            return res.data;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Error fetching categories"
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    createCategory: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(
                `/api/admin/posts/categories`,
                data
            );
            return res;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Error creating category"
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    updateCategory: async (id, data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.put(
                `/api/admin/posts/categories/${id}`,
                data
            );
            return res;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Error updating category"
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    deleteCategory: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.delete(
                `/api/admin/posts/categories/${id}`
            );
            return res;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Error deleting category"
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // CRUD for Tags
    getAllTags: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/api/admin/posts/tags`);
            set({ tags: res.data });
            return res.data;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Error fetching tags"
            );
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    createTag: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(`/api/admin/posts/tags`, data);
            return res;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error creating tag");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    updateTag: async (id, data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.put(
                `/api/admin/posts/tags/${id}`,
                data
            );
            return res;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error updating tag");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
    deleteTag: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.delete(
                `/api/admin/posts/tags/${id}`
            );
            return res;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error deleting tag");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));
