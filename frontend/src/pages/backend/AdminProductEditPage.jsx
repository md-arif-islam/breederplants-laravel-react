import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";

export default function AdminProductEditPage() {
    const { currentProduct, isLoading, getProduct, updateProduct, breeders } =
        useProductStore();
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        breeder_id: "",
        genus: "",
        species: "",
        cultivar: "",
        plant_id: "",
        protection_number: "",
        cpvo_expiration_date: "",
        royalty_fee: "",
        sun_icon: false,
        edible_icon: false,
        partial_shade_icon: false,
        blooming_time_icon: false,
        blooming_period: "",
        pruning_icon: false,
        pruning_period: "",
        winter_hardy_icon: false,
        temperature: "",
        height_icon: false,
        height: "",
        width_icon: false,
        width: "",
    });

    useEffect(() => {
        getProduct(id);
    }, [getProduct, id]);

    useEffect(() => {
        if (currentProduct) {
            setFormData({
                breeder_id: currentProduct.breeder_id || "",
                genus: currentProduct.genus || "",
                species: currentProduct.species || "",
                cultivar: currentProduct.cultivar || "",
                plant_id: currentProduct.plant_id || "",
                protection_number: currentProduct.protection_number || "",
                cpvo_expiration_date: currentProduct.cpvo_expiration_date || "",
                royalty_fee: currentProduct.royalty_fee || "",
                sun_icon: currentProduct.sun_icon || false,
                edible_icon: currentProduct.edible_icon || false,
                partial_shade_icon: currentProduct.partial_shade_icon || false,
                blooming_time_icon: currentProduct.blooming_time_icon || false,
                blooming_period: currentProduct.blooming_period || "",
                pruning_icon: currentProduct.pruning_icon || false,
                pruning_period: currentProduct.pruning_period || "",
                winter_hardy_icon: currentProduct.winter_hardy_icon || false,
                temperature: currentProduct.temperature || "",
                height_icon: currentProduct.height_icon || false,
                height: currentProduct.height || "",
                width_icon: currentProduct.width_icon || false,
                width: currentProduct.width || "",
            });
        }
    }, [currentProduct]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateProduct(id, formData);
            if (response.status === 200) {
                navigate(`/admin/products/${id}`);
            }
        } catch (error) {
            console.error("Failed to update product:", error);
        }
    };

    if (isLoading) {
        return (
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
                <div className="container mx-auto px-4 py-8">Loading...</div>
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
                                    Breeder
                                </label>
                                <select
                                    value={formData.breeder_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            breeder_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select Breeder</option>
                                    {breeders?.map((breeder) => (
                                        <option
                                            key={breeder.id}
                                            value={breeder.id}
                                        >
                                            {breeder.company_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Plant ID
                                </label>
                                <input
                                    type="number"
                                    value={formData.plant_id}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            plant_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Genus{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.genus}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            genus: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Species{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.species}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            species: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Cultivar
                                </label>
                                <input
                                    type="text"
                                    value={formData.cultivar}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cultivar: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Protection Number
                                </label>
                                <input
                                    type="number"
                                    value={formData.protection_number}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            protection_number: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    CPVO Expiration Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.cpvo_expiration_date}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            cpvo_expiration_date:
                                                e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Royalty Fee
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.royalty_fee}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            royalty_fee: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="sun_icon"
                                    checked={formData.sun_icon}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            sun_icon: e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5"
                                />
                                <label
                                    htmlFor="sun_icon"
                                    className="text-sm font-medium"
                                >
                                    Sun Icon
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="edible_icon"
                                    checked={formData.edible_icon}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            edible_icon: e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5"
                                />
                                <label
                                    htmlFor="edible_icon"
                                    className="text-sm font-medium"
                                >
                                    Edible Icon
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="partial_shade_icon"
                                    checked={formData.partial_shade_icon}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            partial_shade_icon:
                                                e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5"
                                />
                                <label
                                    htmlFor="partial_shade_icon"
                                    className="text-sm font-medium"
                                >
                                    Partial Shade Icon
                                </label>
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="blooming_time_icon"
                                    checked={formData.blooming_time_icon}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            blooming_time_icon:
                                                e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5"
                                />
                                <label
                                    htmlFor="blooming_time_icon"
                                    className="text-sm font-medium"
                                >
                                    Blooming Time Icon
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Blooming Period
                                </label>
                                <input
                                    type="text"
                                    value={formData.blooming_period}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            blooming_period: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="pruning_icon"
                                    checked={formData.pruning_icon}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            pruning_icon: e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5"
                                />
                                <label
                                    htmlFor="pruning_icon"
                                    className="text-sm font-medium"
                                >
                                    Pruning Icon
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Pruning Period
                                </label>
                                <input
                                    type="text"
                                    value={formData.pruning_period}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            pruning_period: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="winter_hardy_icon"
                                    checked={formData.winter_hardy_icon}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            winter_hardy_icon: e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5"
                                />
                                <label
                                    htmlFor="winter_hardy_icon"
                                    className="text-sm font-medium"
                                >
                                    Winter Hardy Icon
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Temperature
                                </label>
                                <input
                                    type="number"
                                    value={formData.temperature}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            temperature: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="height_icon"
                                    checked={formData.height_icon}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            height_icon: e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5"
                                />
                                <label
                                    htmlFor="height_icon"
                                    className="text-sm font-medium"
                                >
                                    Height Icon
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Height
                                </label>
                                <input
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            height: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="width_icon"
                                    checked={formData.width_icon}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            width_icon: e.target.checked,
                                        })
                                    }
                                    className="h-5 w-5"
                                />
                                <label
                                    htmlFor="width_icon"
                                    className="text-sm font-medium"
                                >
                                    Width Icon
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Width
                                </label>
                                <input
                                    type="number"
                                    value={formData.width}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            width: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Update Product
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
