"use client";

import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminGrowerViewPage() {
    const { currentGrower, isLoading, getGrower, deleteGrower } = useStore();
    const [showPopup, setShowPopup] = useState(false);

    // Fetch id from URL
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getGrower(id);
    }, [getGrower, id]);

    useEffect(() => {
        document.title = currentGrower?.company_name
            ? `Grower - ${currentGrower.company_name} - Breederplants`
            : "Grower - Breederplants";
    }, [currentGrower?.company_name]);

    const handleDelete = async (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        const response = await deleteGrower(id);
        if (response.status === 200) {
            navigate(`/admin/growers`);
        }
        setShowPopup(false);
    };

    const cancelDelete = () => {
        setShowPopup(false);
    };

    // Helper function to display values or N/A
    const displayValue = (value, isLink = false, type = "") => {
        if (!value) return <span className="text-gray-500">N/A</span>;

        if (isLink && type === "website") {
            return (
                <a
                    href={value.startsWith("http") ? value : `https://${value}`}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {value}
                </a>
            );
        }

        if (isLink && type === "phone") {
            return (
                <a
                    href={`tel:${value}`}
                    className="text-blue-600 hover:underline"
                >
                    {value}
                </a>
            );
        }

        return value;
    };

    // Helper function to safely parse JSON and handle null/undefined values
    const safelyParseJSON = (jsonString) => {
        if (!jsonString) return null;
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return null;
        }
    };

    if (isLoading) {
        return (
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
                <div className="container mx-auto px-4 py-8"></div>
            </main>
        );
    }

    // Safely parse JSON data
    const salesReportingQuarters = safelyParseJSON(
        currentGrower?.sales_reporting_quarter
    );
    const productionReportingQuarters = safelyParseJSON(
        currentGrower?.production_reporting_quarter
    );
    const productionReportingValues = safelyParseJSON(
        currentGrower?.production_reporting_values
    );

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                                Grower Details
                            </h2>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Grower ID
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentGrower?.username)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Company Name
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentGrower?.company_name)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Company Email
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentGrower?.company_email)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Contact Person
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(
                                        currentGrower?.contact_person
                                    )}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Phone
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(
                                        currentGrower?.phone,
                                        true,
                                        "phone"
                                    )}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Website
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(
                                        currentGrower?.website,
                                        true,
                                        "website"
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="my-6 border-t border-gray-200"></div>

                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Address Information
                        </h3>
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Street
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentGrower?.street)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    City
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentGrower?.city)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Postal Code
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentGrower?.postal_code)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Country
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentGrower?.country)}
                                </p>
                            </div>
                        </div>

                        <div className="my-6 border-t border-gray-200"></div>

                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Reporting Information
                        </h3>
                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500 mb-3">
                                    Sales Reporting Quarter
                                </h3>
                                {salesReportingQuarters &&
                                salesReportingQuarters.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {salesReportingQuarters.map(
                                            (quarter, index) => (
                                                <span
                                                    key={index}
                                                    className="text-sm bg-primary text-white px-2 py-1 rounded-md font-bold text-[12px] mr-1"
                                                >
                                                    {quarter.toUpperCase()}
                                                </span>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-500">N/A</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500 mb-3">
                                    Production Reporting Quarter
                                </h3>
                                {productionReportingQuarters &&
                                productionReportingQuarters.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {productionReportingQuarters.map(
                                            (quarter, index) => (
                                                <span
                                                    key={index}
                                                    className="text-sm bg-primary text-white px-2 py-1 rounded-md font-bold text-[12px] mr-1"
                                                >
                                                    {quarter.toUpperCase()}
                                                </span>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-500">N/A</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500 mb-3">
                                    Production Reporting Values
                                </h3>
                                {productionReportingValues &&
                                productionReportingValues.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {productionReportingValues.map(
                                            (value, index) => (
                                                <span
                                                    key={index}
                                                    className="text-sm bg-primary text-white px-2 py-1 rounded-md font-bold text-[12px] mr-1"
                                                >
                                                    {value
                                                        .toUpperCase()
                                                        .replace(/_/g, " ")}
                                                </span>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <span className="text-gray-500">N/A</span>
                                )}
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500 mb-3">
                                    Agreement Number
                                </h3>
                                <p className="text-primary font-bold">
                                    {displayValue(
                                        currentGrower?.agreement_number
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-8">
                            <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                onClick={() =>
                                    navigate(`/admin/growers/${id}/edit`)
                                }
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                                Edit
                            </button>
                            <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                onClick={handleDelete}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                </svg>
                                Delete
                            </button>
                            <button
                                onClick={() =>
                                    navigate(`/admin/growers/${id}/products`)
                                }
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 mr-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                                    />
                                </svg>
                                Grower Products
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <p>Are you sure you want to delete this grower?</p>
                        <div className="flex gap-2 mt-4">
                            <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                onClick={confirmDelete}
                            >
                                Yes
                            </button>
                            <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                onClick={cancelDelete}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
