import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useGrowerProductStore = create((set, get) => ({
  isLoading: false,
  growerProducts: null,
  currentPage: 1,
  totalPages: 1,
  currentGrowerProduct: null,
  growers: [],

  getAllGrowerProducts: async (page = 1, searchQuery = "", growerId = "") => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(
        `/api/admin/growers/${growerId}/products?page=${page}&search=${searchQuery}`
      );
      set({
        growerProducts: res.data.data,
        currentPage: res.data.current_page,
        totalPages: res.data.last_page,
      });
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error fetching grower products";
      toast.error(message);
    } finally {
      set({ isLoading: false });
    }
  },

  getGrowerProduct: async (growerId, id) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `/api/admin/growers/${growerId}/products/${id}`
      );
      set({ currentGrowerProduct: response.data });
      set({ growers: response.data.growers });
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch grower product");
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  createGrowerProduct: async (growerId, data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(
        `/api/admin/growers/${growerId}/products`,
        data
      );
      toast.success(response.data.message);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error creating grower product";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateGrowerProduct: async (growerId, id, data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(
        `/api/admin/growers/${growerId}/products/${id}`,
        data
      );
      toast.success(response.data.message);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error updating grower product";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteGrowerProduct: async (growerId, id) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.delete(
        `/api/admin/growers/${growerId}/products/${id}`
      );
      console.log(res.data);
      toast.success(res.data.message);
      return res;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error deleting grower product";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  addQuantityToStock: async (growerId, id, quantity) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.put(
        `/api/admin/growers/${growerId}/products/${id}/add-quantity`,
        { quantity }
      );
      toast.success(response.data.message);
      return response;
    } catch (error) {
      const message = error?.response?.data?.message || "Error adding quantity";
      console.log(error);
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
