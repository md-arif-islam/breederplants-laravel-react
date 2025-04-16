import { Download, Eye, Leaf, Loader2, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useVarietyReportStore } from "../../store/useVarietyReportStore";
import { formatDate } from "../../utils/formatDate.js";

export function VarietyReportCard({ report, onDelete }) {
    const [showPopup, setShowPopup] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const { deleteVarietyReport, exportVarietyReport } =
        useVarietyReportStore();
    const [exportLoading, setExportLoading] = useState(false);

    const handleDelete = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        setShowPopup(false);
        const response = await deleteVarietyReport(report.id);
        if (response.status === 200) {
            onDelete();
        }
    };

    const cancelDelete = () => {
        setShowPopup(false);
    };

    const thumbnailUrl = report?.thumbnail
        ? `${import.meta.env.VITE_API_URL}/${report.thumbnail}`
        : null;

    const isInactive = !report?.grower || !report?.breeder;

    const getFormattedDate = (dateString) => {
        try {
            return formatDate(dateString);
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
        }
    };

    return (
        <div className="bg-white rounded-xl shadow overflow-hidden group relative px-3">
            <div className="relative h-96 w-full">
                {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <Leaf className="w-8 h-8 text-gray-500 animate-pulse" />
                    </div>
                )}
                <img
                    src={thumbnailUrl || "/placeholder.svg"}
                    alt={report.variety_name}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover rounded-lg mt-3 transition-opacity duration-300 ${
                        imgLoaded ? "opacity-100" : "opacity-0"
                    } ${isInactive ? "grayscale opacity-80" : ""}`}
                />
                <div className="absolute left-1/2 -translate-x-1/2 bottom-5 flex gap-2 p-2 border border-white rounded-lg backdrop-blur-md bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                        href={`/admin/variety-reports/${report.id}`}
                        className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                    </a>
                    <a
                        href={`/admin/variety-reports/${report.id}/edit`}
                        className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors"
                    >
                        <Pencil className="w-5 h-5" />
                    </a>
                    <button
                        onClick={handleDelete}
                        className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setExportLoading(true);
                            exportVarietyReport(report.id).finally(() =>
                                setExportLoading(false)
                            );
                        }}
                        disabled={exportLoading}
                        className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors"
                    >
                        {exportLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Download className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
            <div className="p-4 border-b">
                <h3
                    className={`text-lg font-semibold ${
                        isInactive ? "text-gray-600" : ""
                    }`}
                >
                    {report.variety_name}
                    {isInactive && (
                        <span className="ml-2 text-xs font-normal text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                            Inactive
                        </span>
                    )}
                </h3>
            </div>
            <div className="p-4 grid gap-2 text-sm">
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Company</span>
                    <span
                        className={`justify-self-end ${
                            !report?.grower ? "text-gray-400 italic" : ""
                        }`}
                    >
                        {report?.grower?.company_name || "Not assigned"}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Breeder name</span>
                    <span
                        className={`justify-self-end ${
                            !report?.breeder ? "text-gray-400 italic" : ""
                        }`}
                    >
                        {report?.breeder?.company_name || "Not assigned"}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Date of propagation</span>
                    <span className="justify-self-end">
                        {getFormattedDate(report.date_of_propagation)}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Date of potting</span>
                    <span className="justify-self-end">
                        {getFormattedDate(report.date_of_potting)}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Amount of plants</span>
                    <span className="justify-self-end">
                        {report.amount_of_plants}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Amount of samples</span>
                    <span className="justify-self-end">22</span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Next Sample Date</span>
                    <span className="justify-self-end">
                        {getFormattedDate(
                            JSON.parse(report.samples_schedule)[0]
                        )}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Start Date</span>
                    <span className="justify-self-end">
                        {getFormattedDate(report.start_date)}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">End Date</span>
                    <span className="justify-self-end">
                        {getFormattedDate(report.end_date)}
                    </span>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <p>
                            Are you sure you want to delete this variety report?
                        </p>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={confirmDelete}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                            >
                                Yes
                            </button>
                            <button
                                onClick={cancelDelete}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
