import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.withXSRFToken = true;
axios.defaults.headers.common["Accept"] = "application/json";

export const axiosInstance = axios.create({
  // baseURL: "http://127.0.0.1:8000/",
  baseURL: "http://192.168.68.112:8000/",
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

// Add a response interceptor to catch 401 errors (expired token)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Optionally, show a toast notification if you're using react-hot-toast
      toast.error("Session expired. Please log in again.");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
