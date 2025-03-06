import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useVarietyReportStore = create((set, get) => ({
    isLoading: false,
    growers: [],
    breeders: [],
    currentPage: 1,
    totalPages: 1,
    varietyReports: [],
    varietyReport: null,
    getAllVarietyReports: async (
        page = 1,
        searchQuery = "",
        sort = "",
        growerId = ""
    ) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/public/variety-reports?page=${page}&search=${searchQuery}&sort=${sort}&grower_id=${growerId}`
            );
            set({
                varietyReports: res.data.varietyReports.data,
                currentPage: res.data.varietyReports.current_page,
                totalPages: res.data.varietyReports.last_page,
                growers: res.data.growers,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching variety reports";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getVarietyReportsByUser: async (userId) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/api/variety-reports`);
            set({
                varietyReports: res.data.varietyReports.data,
                currentPage: res.data.varietyReports.current_page,
                totalPages: res.data.varietyReports.last_page,
                growers: res.data.growers,
            });
            return res.data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching variety reports";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getVarietyReportById: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/admin/variety-reports/${id}`
            );
            set({ varietyReport: res.data.varietyReport });
            set({ growers: res.data.growers });
            set({ breeders: res.data.breeders });
            return res.data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching variety report";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    getUserVarietyReportById: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(`/api/variety-reports/${id}`);
            set({ varietyReport: res.data.varietyReport });
            set({ growers: res.data.growers });
            set({ breeders: res.data.breeders });
            return res.data;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching variety report";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // createvarietyreport
    getCreateVarietyReport: async () => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                "/api/admin/variety-reports/create"
            );
            set({ growers: res.data.growers });
            set({ breeders: res.data.breeders });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error creating variety report";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    createVarietyReport: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(
                "/api/admin/variety-reports",
                data
            );
            toast.success(res.data.message);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error creating variety report";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // updatevarietyreport
    updateVarietyReport: async (id, data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.put(
                `/api/admin/variety-reports/${id}`,
                data
            );
            toast.success(res.data.message);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error updating variety report";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    // deletevarietyreport
    deleteVarietyReport: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.delete(
                `/api/admin/variety-reports/${id}`
            );
            toast.success(res.data.message);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error deleting variety report";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    exportVarietyReport: async (id) => {
        set({ error: null });
        try {
            const response = await axiosInstance.get(
                `/api/admin/variety-reports/${id}/export`,
                { responseType: "blob" }
            );

            // Ensure the header exists before parsing the filename.
            const disposition = response.headers["content-disposition"];
            let filename = "download.xlsx";
            if (disposition && disposition.indexOf("filename=") !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, "");
                }
            }

            // Create a Blob with the correct MIME type.
            const blob = new Blob([response.data], {
                type:
                    response.headers["content-type"] ||
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);

            // Create a temporary link element and trigger the download.
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", filename);
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            set({ isLoading: false });
            return response;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            toast.error(
                error?.response?.data?.message || "Error downloading file"
            );
            return error.response;
        }
    },

    importVarietyReport: async (formData) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(
                "/api/admin/variety-reports/import",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            toast.success(res.data.message);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error importing variety reports";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    reminderVarietyReport: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/admin/variety-reports/${id}/reminder`
            );
            toast.success(res.data.message);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error sending reminder";
            toast.error(message);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },
}));
