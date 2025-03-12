import { useState } from "react";
import axios from "axios";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export default function useContactStore() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const submitContact = async (contactData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axiosInstance.post(
                `api/public/contact`,
                contactData
            );
            return response.data;
        } catch (error) {
            const message =
                error?.response?.data?.message || "Error fetching products";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return { submitContact, loading, error };
}
