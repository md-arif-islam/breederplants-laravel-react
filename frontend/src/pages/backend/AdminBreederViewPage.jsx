"use client";

import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageTitleContext } from "../../context/PageTitleContext";
import { useStore } from "../../store/useStore";

export default function AdminBreederViewPage() {
    const { currentBreeder, isLoading, getBreeder, deleteBreeder } = useStore();
    const [showPopup, setShowPopup] = useState(false);
    const { setTitle } = useContext(PageTitleContext);

    // Fetch id from URL
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getBreeder(id);
    }, [getBreeder, id]);

    useEffect(() => {
        document.title = currentBreeder?.company_name
            ? `Breeder - ${currentBreeder.company_name} - Breederplants`
            : "Breeder - Breederplants";

        setTitle(
            currentBreeder?.company_name
                ? "Breeder - " + currentBreeder?.company_name
                : "Breeder Details"
        );
    }, [currentBreeder?.company_name, setTitle]);

    const handleDelete = async (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        const response = await deleteBreeder(id);
        if (response.status === 200) {
            navigate(`/admin/breeders`);
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
                <div className="container mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div className="h-8 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                            </div>

                            {/* Basic information skeleton */}
                            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                        <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>

                            <div className="my-6 border-t border-gray-200"></div>

                            {/* Address information skeleton */}
                            <div className="h-6 bg-gray-200 rounded w-1/5 mb-4 animate-pulse"></div>
                            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                                        <div className="h-6 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                    </div>
                                ))}
                            </div>

                            {/* Action buttons skeleton */}
                            <div className="flex flex-wrap gap-2 pt-8">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-10 bg-gray-200 rounded w-24 animate-pulse"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    // Safely parse JSON data
    const salesReportingQuarters = safelyParseJSON(
        currentBreeder?.sales_reporting_quarter
    );
    const productionReportingQuarters = safelyParseJSON(
        currentBreeder?.production_reporting_quarter
    );
    const productionReportingValues = safelyParseJSON(
        currentBreeder?.production_reporting_values
    );

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">
                                Breeder Details
                            </h2>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Breeder ID
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentBreeder?.username)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Company Name
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentBreeder?.company_name)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Company Email
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(
                                        currentBreeder?.company_email
                                    )}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Contact Person
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(
                                        currentBreeder?.contact_person
                                    )}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Phone
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(
                                        currentBreeder?.phone,
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
                                        currentBreeder?.website,
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
                                    {displayValue(currentBreeder?.street)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    City
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentBreeder?.city)}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Postal Code
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentBreeder?.postal_code)}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Country
                                </h3>
                                <p className="font-medium text-gray-900">
                                    {displayValue(currentBreeder?.country)}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-8">
                            <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                onClick={() =>
                                    navigate(`/admin/breeders/${id}/edit`)
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
                                    navigate(`/admin/breeders/${id}/products`)
                                }
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                            >
                                <svg
                                    version="1.0"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 256.000000 256.000000"
                                    className="h-4 w-4 mr-2"
                                    preserveAspectRatio="xMidYMid meet"
                                >
                                    <g
                                        transform="translate(0.000000,256.000000) scale(0.100000,-0.100000)"
                                        stroke="none"
                                    >
                                        <path d="M543 2473 c-35 -24 -63 -244 -51 -395 23 -288 195 -525 428 -588 25 -7 92 -15 149 -19 l104 -6 19 -55 c29 -85 48 -213 48 -321 l0 -99 -243 0 c-245 0 -267 -3 -267 -37 0 -7 38 -75 85 -152 l85 -139 0 -279 c0 -204 3 -282 12 -291 17 -17 699 -17 716 0 9 9 12 87 12 291 l0 279 86 140 c65 107 84 146 80 164 l-6 24 -238 2 -237 3 -6 125 c-3 69 -9 141 -13 161 -5 25 -3 48 9 75 16 39 94 164 101 164 3 0 33 -9 67 -21 91 -31 199 -24 291 19 158 74 278 269 299 485 6 59 -5 72 -73 86 -293 63 -567 -126 -625 -429 -10 -57 -24 -92 -57 -142 -24 -37 -45 -67 -48 -67 -3 -1 -11 13 -17 30 -9 24 -8 45 4 102 23 109 13 298 -20 402 -61 188 -183 328 -362 415 -114 55 -298 96 -332 73z m192 -105 c288 -83 462 -326 453 -631 l-3 -91 -57 90 c-62 97 -198 259 -243 288 -33 22 -58 12 -63 -23 -3 -17 16 -44 75 -104 87 -90 151 -176 208 -279 l37 -68 -64 0 c-133 0 -250 49 -343 144 -109 113 -166 268 -167 462 0 94 14 212 28 236 6 9 51 2 139 -24z m1234 -355 c22 -6 23 -9 16 -57 -8 -63 -49 -167 -87 -223 -72 -106 -162 -163 -268 -171 -63 -4 -150 11 -150 26 0 15 141 118 217 158 43 23 79 49 81 58 5 21 -15 46 -37 46 -26 0 -151 -68 -214 -116 -31 -24 -59 -44 -62 -44 -6 0 6 31 35 94 48 100 170 200 276 225 46 11 159 13 193 4z m-279 -1109 c0 -3 -25 -48 -56 -100 l-56 -94 -308 0 -308 0 -56 94 c-31 52 -56 97 -56 100 0 3 189 6 420 6 231 0 420 -3 420 -6z m-130 -509 l0 -235 -290 0 -290 0 0 235 0 235 290 0 290 0 0 -235z" />
                                    </g>
                                </svg>
                                Breeder Products
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <p>Are you sure you want to delete this breeder?</p>
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
