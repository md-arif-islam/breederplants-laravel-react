import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useVarietySampleStore = create((set, get) => ({
  isLoading: false,
  varietySample: null,

  getVarietySample: async (id, sampleId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `api/admin/variety-reports/${id}/variety-sample/${sampleId}`
      );
      set({ varietySample: response.data });
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch variety sample");
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  getUserVarietySample: async (id, sampleId) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.get(
        `api/variety-reports/${id}/variety-sample/${sampleId}`
      );
      set({ varietySample: response.data });
      return response.data;
    } catch (error) {
      toast.error("Failed to fetch variety sample");
      console.log(error);
    } finally {
      set({ isLoading: false });
    }
  },

  createVarietySample: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(
        `api/admin/variety-reports/${id}/variety-sample`,
        data
      );
      toast.success(response.data.message);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error creating variety sample";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  createUserVarietySample: async (id, data) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post(
        `api/variety-reports/${id}/variety-sample`,
        data
      );
      toast.success(response.data.message);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error creating variety sample";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateVarietySample: async (id, sampleId, data) => {
    set({ isLoading: true });
    try {
      // console.log(data);
      const response = await axiosInstance.put(
        `api/admin/variety-reports/${id}/variety-sample/${sampleId}`,
        data
      );
      toast.success(response.data.message);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error updating variety report";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateUserVarietySample: async (id, sampleId, data) => {
    set({ isLoading: true });
    try {
      // console.log(data);
      const response = await axiosInstance.put(
        `api/variety-reports/${id}/variety-sample/${sampleId}`,
        data
      );
      toast.success(response.data.message);
      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error updating variety report";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // deletevarietyreport
  deleteVarietySample: async (id, sampleId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.delete(
        `api/admin/variety-reports/${id}/variety-sample/${sampleId}`
      );
      toast.success(res.data.message);
      return res;
    } catch (error) {
      const message =
        error?.response?.data?.message || "Error deleting variety sample";
      toast.error(message);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
