import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store/useStore";

export default function AdminGrowerEditPage() {
    const {
        currentGrower,
        isLoading,
        getGrower,
        updateGrower,
        updateGrowerPassword,
    } = useStore();
    const { id } = useParams();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isPasswordUpdating, setIsPasswordUpdating] = useState(false);

    useEffect(() => {
        document.title = currentGrower?.company_name
            ? `Edit - ${currentGrower.company_name} - Breederplants`
            : "Grower Edit - Breederplants";
    }, [currentGrower?.company_name]);

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
        agreement_number: "",
        company_email: "",
        sales_reporting_quarter: [],
        production_reporting_quarter: [],
        production_reporting_values: [],
        is_active: false,
    });

    const [passwordData, setPasswordData] = useState({
        password: "",
        password_confirmation: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getGrower(id);
    }, [getGrower, id]);

    useEffect(() => {
        if (currentGrower) {
            setFormData({
                username: currentGrower?.username || "",
                company_name: currentGrower?.company_name || "",
                contact_person: currentGrower?.contact_person || "",
                street: currentGrower?.street || "",
                city: currentGrower?.city || "",
                postal_code: currentGrower?.postal_code || "",
                country: currentGrower?.country || "",
                phone: currentGrower?.phone || "",
                website: currentGrower?.website || "",
                agreement_number: currentGrower?.agreement_number || "",
                company_email: currentGrower?.company_email || "",
                sales_reporting_quarter: currentGrower?.sales_reporting_quarter
                    ? JSON.parse(currentGrower.sales_reporting_quarter)
                    : [],
                production_reporting_quarter:
                    currentGrower?.production_reporting_quarter
                        ? JSON.parse(currentGrower.production_reporting_quarter)
                        : [],
                production_reporting_values:
                    currentGrower?.production_reporting_values
                        ? JSON.parse(currentGrower.production_reporting_values)
                        : [],
                is_active: currentGrower?.user?.is_active ? true : false,
            });
        }
    }, [currentGrower]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const response = await updateGrower(id, formData);
            if (response.status === 200) {
                navigate(`/admin/growers/${id}`);
            }
        } catch (error) {
            console.error("Failed to update grower:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsPasswordUpdating(true);
        try {
            const response = await updateGrowerPassword(id, passwordData);
            if (response.status === 200) {
                navigate(`/admin/growers/${id}`);
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
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2 animate-pulse"></div>
                                    <div className="flex gap-4">
                                        {[...Array(4)].map((_, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-2"
                                            >
                                                <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                                                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
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
                                    Grower ID{" "}
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
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Agreement Number{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.agreement_number}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            agreement_number: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Sales Reporting Quarters
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"q1"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    sales_reporting_quarter: e
                                                        .target.checked
                                                        ? [
                                                              ...prev.sales_reporting_quarter,
                                                              "q1",
                                                          ]
                                                        : prev.sales_reporting_quarter.filter(
                                                              (q) => q !== "q1"
                                                          ),
                                                }));
                                            }}
                                            checked={formData.sales_reporting_quarter.includes(
                                                "q1"
                                            )}
                                        />
                                        <span className="text-sm">Q1</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"q2"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    sales_reporting_quarter: e
                                                        .target.checked
                                                        ? [
                                                              ...prev.sales_reporting_quarter,
                                                              "q2",
                                                          ]
                                                        : prev.sales_reporting_quarter.filter(
                                                              (q) => q !== "q2"
                                                          ),
                                                }));
                                            }}
                                            checked={formData.sales_reporting_quarter.includes(
                                                "q2"
                                            )}
                                        />
                                        <span className="text-sm">Q2</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"q3"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    sales_reporting_quarter: e
                                                        .target.checked
                                                        ? [
                                                              ...prev.sales_reporting_quarter,
                                                              "q3",
                                                          ]
                                                        : prev.sales_reporting_quarter.filter(
                                                              (q) => q !== "q3"
                                                          ),
                                                }));
                                            }}
                                            checked={formData.sales_reporting_quarter.includes(
                                                "q3"
                                            )}
                                        />
                                        <span className="text-sm">Q3</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"q4"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    sales_reporting_quarter: e
                                                        .target.checked
                                                        ? [
                                                              ...prev.sales_reporting_quarter,
                                                              "q4",
                                                          ]
                                                        : prev.sales_reporting_quarter.filter(
                                                              (q) => q !== "q4"
                                                          ),
                                                }));
                                            }}
                                            checked={formData.sales_reporting_quarter.includes(
                                                "q4"
                                            )}
                                        />
                                        <span className="text-sm">Q4</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Production Reporting Quarters
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"q1"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    production_reporting_quarter:
                                                        e.target.checked
                                                            ? [
                                                                  ...prev.production_reporting_quarter,
                                                                  "q1",
                                                              ]
                                                            : prev.production_reporting_quarter.filter(
                                                                  (q) =>
                                                                      q !== "q1"
                                                              ),
                                                }));
                                            }}
                                            checked={formData.production_reporting_quarter?.includes(
                                                "q1"
                                            )}
                                        />
                                        <span className="text-sm">Q1</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"q2"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    production_reporting_quarter:
                                                        e.target.checked
                                                            ? [
                                                                  ...prev.production_reporting_quarter,
                                                                  "q2",
                                                              ]
                                                            : prev.production_reporting_quarter.filter(
                                                                  (q) =>
                                                                      q !== "q2"
                                                              ),
                                                }));
                                            }}
                                            checked={formData.production_reporting_quarter?.includes(
                                                "q2"
                                            )}
                                        />
                                        <span className="text-sm">Q2</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"q3"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    production_reporting_quarter:
                                                        e.target.checked
                                                            ? [
                                                                  ...prev.production_reporting_quarter,
                                                                  "q3",
                                                              ]
                                                            : prev.production_reporting_quarter.filter(
                                                                  (q) =>
                                                                      q !== "q3"
                                                              ),
                                                }));
                                            }}
                                            checked={formData.production_reporting_quarter?.includes(
                                                "q3"
                                            )}
                                        />
                                        <span className="text-sm">Q3</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"q4"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    production_reporting_quarter:
                                                        e.target.checked
                                                            ? [
                                                                  ...prev.production_reporting_quarter,
                                                                  "q4",
                                                              ]
                                                            : prev.production_reporting_quarter.filter(
                                                                  (q) =>
                                                                      q !== "q4"
                                                              ),
                                                }));
                                            }}
                                            checked={formData.production_reporting_quarter?.includes(
                                                "q4"
                                            )}
                                        />
                                        <span className="text-sm">Q4</span>
                                    </label>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Production Reporting Fields
                                </label>
                                <div className="flex flex-col gap-2">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"rooted_cuttings"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    production_reporting_values:
                                                        e.target.checked
                                                            ? [
                                                                  ...prev.production_reporting_values,
                                                                  "rooted_cuttings",
                                                              ]
                                                            : prev.production_reporting_values.filter(
                                                                  (q) =>
                                                                      q !==
                                                                      "rooted_cuttings"
                                                              ),
                                                }));
                                            }}
                                            checked={formData.production_reporting_values.includes(
                                                "rooted_cuttings"
                                            )}
                                        />
                                        <span className="text-sm">
                                            Rooted cuttings
                                        </span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"young_plants_pot"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    production_reporting_values:
                                                        e.target.checked
                                                            ? [
                                                                  ...prev.production_reporting_values,
                                                                  "young_plants_pot",
                                                              ]
                                                            : prev.production_reporting_values.filter(
                                                                  (q) =>
                                                                      q !==
                                                                      "young_plants_pot"
                                                              ),
                                                }));
                                            }}
                                            checked={formData.production_reporting_values.includes(
                                                "young_plants_pot"
                                            )}
                                        />
                                        <span className="text-sm">
                                            Young plants in pot
                                        </span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"young_plants_field"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    production_reporting_values:
                                                        e.target.checked
                                                            ? [
                                                                  ...prev.production_reporting_values,
                                                                  "young_plants_field",
                                                              ]
                                                            : prev.production_reporting_values.filter(
                                                                  (q) =>
                                                                      q !==
                                                                      "young_plants_field"
                                                              ),
                                                }));
                                            }}
                                            checked={formData.production_reporting_values.includes(
                                                "young_plants_field"
                                            )}
                                        />
                                        <span className="text-sm">
                                            Young plants open field
                                        </span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"finishing_plants"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    production_reporting_values:
                                                        e.target.checked
                                                            ? [
                                                                  ...prev.production_reporting_values,
                                                                  "finishing_plants",
                                                              ]
                                                            : prev.production_reporting_values.filter(
                                                                  (q) =>
                                                                      q !==
                                                                      "finishing_plants"
                                                              ),
                                                }));
                                            }}
                                            checked={formData.production_reporting_values.includes(
                                                "finishing_plants"
                                            )}
                                        />
                                        <span className="text-sm">
                                            Finishing plants
                                        </span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            key={"labels"}
                                            className="rounded border-primary"
                                            onChange={(e) => {
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    production_reporting_values:
                                                        e.target.checked
                                                            ? [
                                                                  ...prev.production_reporting_values,
                                                                  "labels",
                                                              ]
                                                            : prev.production_reporting_values.filter(
                                                                  (q) =>
                                                                      q !==
                                                                      "labels"
                                                              ),
                                                }));
                                            }}
                                            checked={formData.production_reporting_values.includes(
                                                "labels"
                                            )}
                                        />
                                        <span className="text-sm">Labels</span>
                                    </label>
                                </div>
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
                                "Update Grower"
                            )}
                        </button>
                    </form>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        Change Password
                    </h2>
                    <form
                        onSubmit={handlePasswordSubmit}
                        className="space-y-4 overflow-hidden"
                    >
                        <div className="grid gap-6 md:grid-cols-2 ">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Password{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={passwordData.password}
                                        onChange={(e) =>
                                            setPasswordData({
                                                ...passwordData,
                                                password: e.target.value,
                                            })
                                        }
                                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Generate
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        Show
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Confirm Password{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={passwordData.password_confirmation}
                                    onChange={(e) =>
                                        setPasswordData({
                                            ...passwordData,
                                            password_confirmation:
                                                e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={isPasswordUpdating}
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center justify-center"
                        >
                            {isPasswordUpdating ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                "Update Password"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
