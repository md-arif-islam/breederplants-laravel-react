"use client";

import { useEffect, useState } from "react";
import {
    Pencil,
    Trash2,
    Sun,
    Leaf,
    Cloud,
    Scissors,
    Thermometer,
    ArrowUp,
    ArrowLeftRight,
    Flower,
    Calendar,
    DollarSign,
    Shield,
    AlertCircle,
    ChevronLeft,
} from "lucide-react";
import { useProductStore } from "../../store/useProductStore";
import { useNavigate, useParams } from "react-router-dom";

// Helper component for lazy loading images with a skeleton placeholder
function LazyImage({ src, alt }) {
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className="relative w-full h-full">
            {/* Placeholder displayed until image is loaded */}
            {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <Leaf className="w-8 h-8 text-gray-400 animate-pulse" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
        </div>
    );
}

export default function AdminProductViewPage() {
    const { currentProduct, isLoading, getProduct, deleteProduct } =
        useProductStore();
    const [showPopup, setShowPopup] = useState(false);

    // Fetch id from URL
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Product Details - Breederplants";
    }, []);

    useEffect(() => {
        getProduct(id);
    }, [getProduct, id]);

    const handleDelete = async (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        setShowPopup(false);
        const response = await deleteProduct(id);
        if (response.status === 200) {
            navigate(`/admin/products`);
        }
    };

    const cancelDelete = () => {
        setShowPopup(false);
    };

    if (isLoading || !currentProduct) {
        return (
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
                <div className="container mx-auto px-4 py-8"></div>
            </main>
        );
    }

    const productImages = currentProduct.images
        ? JSON.parse(currentProduct.images)
        : [];

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gradient-to-b from-gray-50 to-white">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Content */}

                    <div className="p-6 ">
                        <div className="bg-gray-50 rounded-lg p-5 md:col-span-2 mb-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                                {productImages.map((imageUrl, index) => {
                                    const fullImageUrl = `${
                                        import.meta.env.VITE_API_URL
                                    }/${imageUrl}`;
                                    return (
                                        <div
                                            key={index}
                                            className="aspect-square rounded-lg overflow-hidden"
                                        >
                                            <LazyImage
                                                src={
                                                    fullImageUrl ||
                                                    "/placeholder.svg"
                                                }
                                                alt={`Sample image ${
                                                    index + 1
                                                }`}
                                            />
                                        </div>
                                    );
                                })}
                            </div>

                            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                <span className="text-2xl mr-2">
                                    {currentProduct?.genus || ""}
                                </span>
                                <span className="text-xl italic">
                                    {currentProduct?.species || ""}
                                </span>
                                <span className="ml-2 text-lg">
                                    {currentProduct?.cultivar || ""}
                                </span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-gray-700">
                                                Genus
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {currentProduct?.genus}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-gray-700">
                                                Species
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900 italic">
                                            {currentProduct?.species}
                                        </span>
                                    </div>
                                </div>
                                <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <span className="text-gray-700">
                                                Cultivar
                                            </span>
                                        </div>
                                        <span className="font-medium text-gray-900">
                                            {currentProduct?.cultivar}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid gap-8 md:grid-cols-2">
                            {/* Basic Information */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                                    Basic Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                        <span className="text-gray-600">
                                            Plant ID
                                        </span>
                                        <span className="font-medium text-gray-900 bg-emerald-100 px-3 py-1 rounded-full">
                                            {currentProduct?.plant_id}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                        <span className="text-gray-600">
                                            Protection Number
                                        </span>
                                        <span className="font-medium text-gray-900">
                                            {currentProduct?.protection_number}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                                        <span className="text-gray-600">
                                            CPVO Expiration
                                        </span>
                                        <span className="font-medium text-gray-900 flex items-center">
                                            <Calendar className="h-4 w-4 mr-1 text-emerald-600" />
                                            {
                                                currentProduct?.cpvo_expiration_date
                                            }
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">
                                            Royalty Fee
                                        </span>
                                        <span className="font-medium text-gray-900 flex items-center">
                                            <DollarSign className="h-4 w-4 mr-1 text-emerald-600" />
                                            {currentProduct?.royalty_fee}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Growing Conditions */}
                            <div className="bg-gray-50 rounded-lg p-5">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Leaf className="h-5 w-5 mr-2 text-emerald-600" />
                                    Growing Conditions
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                                        <Sun
                                            className={`h-8 w-8 ${
                                                currentProduct?.sun_icon
                                                    ? "text-amber-500"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                        <span className="mt-2 text-sm text-gray-600">
                                            Full Sun
                                        </span>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                                        <Cloud
                                            className={`h-8 w-8 ${
                                                currentProduct?.partial_shade_icon
                                                    ? "text-blue-500"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                        <span className="mt-2 text-sm text-gray-600">
                                            Partial Shade
                                        </span>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                                        <Leaf
                                            className={`h-8 w-8 ${
                                                currentProduct?.edible_icon
                                                    ? "text-emerald-500"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                        <span className="mt-2 text-sm text-gray-600">
                                            Edible
                                        </span>
                                    </div>
                                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                                        <Thermometer className="h-8 w-8 text-red-500" />
                                        <span className="mt-2 text-sm text-gray-600">
                                            {currentProduct?.temperature}°
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Plant Characteristics */}
                            <div className="bg-gray-50 rounded-lg p-5 md:col-span-2">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <Flower className="h-5 w-5 mr-2 text-emerald-600" />
                                    Plant Characteristics
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Flower className="h-5 w-5 text-purple-500 mr-2" />
                                                <span className="text-gray-700">
                                                    Blooming Period
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {
                                                    currentProduct?.blooming_period
                                                }
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Scissors className="h-5 w-5 text-blue-500 mr-2" />
                                                <span className="text-gray-700">
                                                    Pruning Period
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {currentProduct?.pruning_period}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <ArrowUp className="h-5 w-5 text-emerald-500 mr-2" />
                                                <span className="text-gray-700">
                                                    Height
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {currentProduct?.height} cm
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 ">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <ArrowLeftRight className="h-5 w-5 text-emerald-500 mr-2" />
                                                <span className="text-gray-700">
                                                    Width
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">
                                                {currentProduct?.width} cm
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 pt-8">
                            <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                onClick={() =>
                                    navigate(`/admin/products/${id}/edit`)
                                }
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </button>
                            <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                onClick={handleDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </button>
                        </div>{" "}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex items-center mb-4 text-red-600">
                            <AlertCircle className="h-6 w-6 mr-2" />
                            <h3 className="text-lg font-semibold">
                                Confirm Deletion
                            </h3>
                        </div>
                        <p className="mb-6 text-gray-600">
                            Are you sure you want to delete{" "}
                            <span className="font-medium">
                                {currentProduct?.genus}{" "}
                                {currentProduct?.species}{" "}
                                {currentProduct?.cultivar}{" "}
                            </span>
                            ? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={cancelDelete}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 text-sm font-medium rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors"
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
