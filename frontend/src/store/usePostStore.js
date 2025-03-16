import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const usePostStore = create((set) => ({
    isLoading: false,
    posts: [],
    currentPost: null,

    getAllPosts: async (page = 1, searchQuery = "") => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/admin/posts?page=${page}&search=${searchQuery}`
            );
            set({ posts: res.data.data }); // Assuming posts are in res.data.data
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
            toast.success(res.data.message);
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
            toast.success(res.data.message);
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
            toast.success(res.data.message);
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
            const res = await axiosInstance.get(`/api/admin/categories`);
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
            const res = await axiosInstance.post(`/api/admin/categories`, data);
            toast.success(res.data.message);
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
                `/api/admin/categories/${id}`,
                data
            );
            toast.success(res.data.message);
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
                `/api/admin/categories/${id}`
            );
            toast.success(res.data.message);
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
            const res = await axiosInstance.get(`/api/admin/tags`);
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
            const res = await axiosInstance.post(`/api/admin/tags`, data);
            toast.success(res.data.message);
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
            const res = await axiosInstance.put(`/api/admin/tags/${id}`, data);
            toast.success(res.data.message);
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
            const res = await axiosInstance.delete(`/api/admin/tags/${id}`);
            toast.success(res.data.message);
            return res;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error deleting tag");
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));
