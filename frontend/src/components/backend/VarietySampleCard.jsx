import { Eye, Leaf, Pencil, Trash2 } from "lucide-react";
import React, { useState } from "react";
import { useVarietySampleStore } from "../../store/useVarietySampleStore";
import { formatDate } from "../../utils/formatDate"; // Import formatDate

export function VarietySampleCard({ sample, varietyReportId, onDelete }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const { deleteVarietySample } = useVarietySampleStore();

    // Build full image URL
    let imagePath = "/placeholder.svg";
    try {
        const storedImages = sample && JSON.parse(sample.images);
        if (storedImages && storedImages[0]) {
            imagePath = `${import.meta.env.VITE_API_URL}/${storedImages[0]}`;
        }
    } catch (error) {
        console.error("Error parsing images: ", error);
    }

    const handleDelete = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        setShowPopup(false);
        const response = await deleteVarietySample(varietyReportId, sample.id);
        if (response.status === 200) {
            onDelete(); // trigger parent callback to refresh data
        } else {
            console.error("Error deleting variety sample");
        }
    };

    const cancelDelete = () => {
        setShowPopup(false);
    };

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
                {/* Placeholder shown until image loads */}
                {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <Leaf className="w-8 h-8 text-gray-500 animate-pulse" />
                    </div>
                )}
                <img
                    src={imagePath}
                    alt="Variety Sample"
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover rounded-lg mt-3 transition-opacity duration-300 ${
                        imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                />

                {/* Hover Action Icons */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-5 flex gap-2 p-2 border border-white rounded-lg backdrop-blur-md bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a
                        href={`/admin/variety-reports/${varietyReportId}/variety-sample/${sample.id}`}
                        className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                    </a>
                    <a
                        href={`/admin/variety-reports/${varietyReportId}/variety-sample/${sample.id}/edit`}
                        className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors"
                    >
                        <Pencil className="w-5 h-5" />
                    </a>
                    <form onSubmit={handleDelete} className="inline-block">
                        <button
                            type="submit"
                            className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>

            <div className="p-4 grid gap-2 text-sm">
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Sample Date</span>
                    <span className="justify-self-end uppercase">
                        {getFormattedDate(sample.sample_date)}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Leaf Color</span>
                    <span className="justify-self-end uppercase">
                        {sample.leaf_color}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Amount of Branches</span>
                    <span className="justify-self-end uppercase">
                        {sample.amount_of_branches}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Flower Buds</span>
                    <span className="justify-self-end uppercase">
                        {sample.flower_buds == 1 ? "Yes" : "No"}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Branch Color</span>
                    <span className="justify-self-end uppercase">
                        {sample.branch_color}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Roots</span>
                    <span className="justify-self-end uppercase">
                        {sample.roots}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Flower Color</span>
                    <span className="justify-self-end uppercase">
                        {sample.flower_color}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Flower Petals</span>
                    <span className="justify-self-end uppercase">
                        {sample.flower_petals}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Flowering Time</span>
                    <span className="justify-self-end uppercase">
                        {sample.flowering_time}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Length of Flowering</span>
                    <span className="justify-self-end uppercase">
                        {sample.length_of_flowering}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Seeds</span>
                    <span className="justify-self-end uppercase">
                        {sample.seeds}
                    </span>
                </div>
                <div className="grid grid-cols-2">
                    <span className="text-gray-600">Amount of Seeds</span>
                    <span className="justify-self-end uppercase">
                        {sample.amount_of_seeds}
                    </span>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <p>
                            Are you sure you want to delete this variety sample?
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
