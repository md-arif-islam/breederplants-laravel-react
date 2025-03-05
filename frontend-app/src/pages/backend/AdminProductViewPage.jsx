import React, { useEffect, useState } from "react";
import { Pencil, Trash2, TreePineIcon } from "lucide-react";
import { useProductStore } from "../../store/useProductStore";
import { useNavigate, useParams } from "react-router-dom";

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

    if (isLoading) {
        return (
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
                <div className="container mx-auto px-4 py-8"></div>
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                {/* Sample Details */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Plant ID
                                    </h3>
                                    <p className="mt-1">
                                        {currentProduct?.plant_id}
                                    </p>
                                </div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Genus
                                </h3>
                                <p className="mt-1">{currentProduct?.genus}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Species
                                </h3>
                                <p className="mt-1">
                                    {currentProduct?.species}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Cultivar
                                </h3>
                                <p className="mt-1">
                                    {currentProduct?.cultivar}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Protection Number
                                </h3>
                                <p className="mt-1">
                                    {currentProduct?.protection_number}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    CPVO Expiration Date
                                </h3>
                                <p className="mt-1">
                                    {currentProduct?.cpvo_expiration_date}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Royalty Fee
                                </h3>
                                <p className="mt-1">
                                    {currentProduct?.royalty_fee}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Blooming Period
                                </h3>
                                <p className="mt-1">
                                    {currentProduct?.blooming_period}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Pruning Period
                                </h3>
                                <p className="mt-1">
                                    {currentProduct?.pruning_period}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Temperature
                                </h3>
                                <p className="mt-1">
                                    {currentProduct?.temperature}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Height
                                </h3>
                                <p className="mt-1">{currentProduct?.height}</p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-gray-500">
                                    Width
                                </h3>
                                <p className="mt-1">{currentProduct?.width}</p>
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
                        </div>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <p>Are you sure you want to delete this product?</p>
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
