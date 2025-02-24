import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useProductionReportStore = create((set, get) => ({
    isLoading: false,
    productionReports: [],
    currentPage: 1,
    totalPages: 1,
    currentProductionReport: null,

    getAllProductionReportsForAdmin: async (
        page = 1,
        searchQuery = "",
        grower = "",
        quarter = "",
        status = ""
    ) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/admin/production-reports?page=${page}&search=${searchQuery}&grower=${grower}&quarter=${quarter}&status=${status}`
            );
            set({
                productionReports: res.data.data, // Assuming the production reports are in the `data` property
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching production reports";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getProductionReportById: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/admin/production-reports/${id}`
            );
            set({ currentProductionReport: res.data });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching production report";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    deleteProductionReport: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.delete(
                `/api/admin/production-reports/${id}/empty`
            );
            toast.success(res.data.message);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error deleting production report";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getAllProductionReports: async (page = 1, searchQuery = "") => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/production-reports?page=${page}&search=${searchQuery}`
            );
            set({
                productionReports: res.data.data,
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching production reports";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getProductionReport: async (year, quarter) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/production-reports/create/${year}/${quarter}`
            );
            set({
                currentProductionReport: res.data,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching production report";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    submitProductionReport: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(
                `/api/production-reports`,
                data
            );
            toast.success(res.data.message);
            return res;
        } catch (error) {
            console.log(error);
            const message =
                error?.response?.data?.message ||
                "Error submitting production report";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    exportProductionReport: async (id) => {
        set({ error: null });
        try {
            const response = await axiosInstance.get(
                `/api/admin/production-reports/${id}/export`,
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
}));
