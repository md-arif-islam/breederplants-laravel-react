import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common["Accept"] = "application/json";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        Accept: "application/json",
    },
});

// Add a request interceptor to dynamically set the Authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Only handle 401 if the request is not to our login/signout endpoints
        if (
            error.response &&
            error.response.status === 401 &&
            !error.config.url.includes("/login")
        ) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.error("Session expired. Please log in again.");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
