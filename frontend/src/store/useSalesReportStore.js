import { toast } from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useSalesReportStore = create((set, get) => ({
    isLoading: false,
    salesReports: [],
    currentPage: 1,
    totalPages: 1,
    currentSalesReport: null,

    getAllSalesReportsForAdmin: async (
        page = 1,
        searchQuery = "",
        grower = "",
        quarter = "",
        status = ""
    ) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/admin/sales-reports?page=${page}&search=${searchQuery}&grower=${grower}&quarter=${quarter}&status=${status}`
            );
            set({
                salesReports: res.data.data, // Assuming the sales reports are in the `data` property
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching sales reports";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getSalesReportById: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/admin/sales-reports/${id}`
            );
            set({ currentSalesReport: res.data });
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error fetching sales report";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    deleteSalesReport: async (id) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.delete(
                `/api/admin/sales-reports/${id}/empty`
            );
            toast.success(res.data.message);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error deleting sales report";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getAllSalesReports: async (page = 1, searchQuery = "") => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/sales-reports?page=${page}&search=${searchQuery}`
            );
            set({
                salesReports: res.data.data,
                currentPage: res.data.current_page,
                totalPages: res.data.last_page,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error fetching sales reports";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    getSalesReport: async (year, quarter) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.get(
                `/api/sales-reports/create/${year}/${quarter}`
            );
            set({
                currentSalesReport: res.data,
            });
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error fetching sales report";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    submitSalesReport: async (data) => {
        set({ isLoading: true });
        try {
            const res = await axiosInstance.post(`/api/sales-reports`, data);
            toast.success(res.data.message);
            return res;
        } catch (error) {
            const message =
                error?.response?.data?.message ||
                "Error submitting sales report";
            toast.error(message);
        } finally {
            set({ isLoading: false });
        }
    },

    exportSalesReport: async (id) => {
        set({ error: null });
        try {
            const response = await axiosInstance.get(
                `/api/admin/sales-reports/${id}/export`,
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
