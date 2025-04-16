import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store/useStore";

export default function AdminBreederEditPage() {
    const {
        currentBreeder,
        isLoading,
        getBreeder,
        updateBreeder,
        updateBreederPassword,
    } = useStore();
    const { id } = useParams();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

    const [formData, setFormData] = useState({
        username: "",
        company_name: "",
        contact_person: "",
        street: "",
        city: "",
        postal_code: "",
        country: "",
        phone: "",
        website: "",
        company_email: "",
        is_active: false,
    });

    const [passwordData, setPasswordData] = useState({
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = `Edit Breeder- Breederplants`;
    }, []);

    useEffect(() => {
        getBreeder(id);
    }, [getBreeder, id]);

    useEffect(() => {
        if (currentBreeder) {
            setFormData({
                username: currentBreeder.username || "",
                company_name: currentBreeder.company_name || "",
                contact_person: currentBreeder.contact_person || "",
                street: currentBreeder.street || "",
                city: currentBreeder.city || "",
                postal_code: currentBreeder.postal_code || "",
                country: currentBreeder.country || "",
                phone: currentBreeder.phone || "",
                website: currentBreeder.website || "",
                company_email: currentBreeder.company_email || "",
                is_active: currentBreeder.user?.is_active ? true : false,
            });
        }
    }, [currentBreeder]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const response = await updateBreeder(id, formData);
            if (response.status === 200) {
                navigate(`/admin/breeders/${id}`);
            }
        } catch (error) {
            console.error("Failed to update breeder:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsPasswordUpdating(true);
        try {
            const response = await updateBreederPassword(id, passwordData);
            if (response.status === 200) {
                navigate(`/admin/breeders/${id}`);
            }
        } catch (error) {
            console.error("Failed to update password:", error);
        } finally {
            setIsPasswordUpdating(false);
        }
    };

    const generatePassword = () => {
        const password = Math.random().toString(36).slice(-8);
        setPasswordData({ password, password_confirmation: password });
    };

    if (isLoading) {
        return (
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow p-6 mb-6">
                        <div className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                {[...Array(10)].map((_, index) => (
                                    <div key={index}>
                                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                                        <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                                    </div>
                                ))}
                            </div>
                            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
                        <div className="space-y-4">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                                    <div className="flex gap-2">
                                        <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
                                        <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                                        <div className="h-10 bg-gray-200 rounded w-16 animate-pulse"></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2 animate-pulse"></div>
                                    <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                                </div>
                            </div>
                            <div className="h-10 bg-gray-200 rounded w-full animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Breeder ID{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            username: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Company Name{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.company_name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            company_name: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Company Email{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.company_email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            company_email: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Contact Person{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.contact_person}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            contact_person: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Street{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.street}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            street: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        City{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                city: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Postal Code{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.postal_code}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                postal_code: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Country{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            country: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            phone: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Website
                                </label>
                                <input
                                    type="url"
                                    value={formData.website}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            website: e.target.value,
                                        })
                                    }
                                    placeholder="Enter website URL"
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isUpdating}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                        >
                            {isUpdating ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Update Breeder"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
