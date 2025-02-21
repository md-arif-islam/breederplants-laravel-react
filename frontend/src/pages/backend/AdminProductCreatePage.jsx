import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../store/useProductStore";
import { useStore } from "../../store/useStore";

export default function AdminProductCreatePage() {
    const { isLoading, createProduct } = useProductStore();
    const { breeders, getAllBreeders } = useStore();
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
        document.title = "Create Product - Breederplants";
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await createProduct(formData);
            if (response.status === 200) {
                navigate(`/admin/products`);
            }
        } catch (error) {
            console.error("Failed to create product:", error);
        }
    };

    useEffect(() => {
        // Fetch all breeders
        getAllBreeders();
    }, [getAllBreeders]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value,
            };
        });
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
                                    name="breeder_id"
                                    value={formData.breeder_id}
                                    onChange={handleChange}
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
                                    name="plant_id"
                                    value={formData.plant_id}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Genus
                                </label>
                                <input
                                    type="text"
                                    name="genus"
                                    value={formData.genus}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Species
                                </label>
                                <input
                                    type="text"
                                    name="species"
                                    value={formData.species}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Cultivar
                                </label>
                                <input
                                    type="text"
                                    name="cultivar"
                                    value={formData.cultivar}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Protection Number
                                </label>
                                <input
                                    type="number"
                                    name="protection_number"
                                    value={formData.protection_number}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    CPVO Expiration Date
                                </label>
                                <input
                                    type="date"
                                    name="cpvo_expiration_date"
                                    value={formData.cpvo_expiration_date || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Royalty Fee
                                </label>
                                <input
                                    type="number"
                                    name="royalty_fee"
                                    step="0.01"
                                    value={formData.royalty_fee}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Blooming Period
                                </label>
                                <input
                                    type="text"
                                    name="blooming_period"
                                    value={formData.blooming_period}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Pruning Period
                                </label>
                                <input
                                    type="text"
                                    name="pruning_period"
                                    value={formData.pruning_period}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Temperature
                                </label>
                                <input
                                    type="number"
                                    name="temperature"
                                    value={formData.temperature}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Height
                                </label>
                                <input
                                    type="number"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Width
                                </label>
                                <input
                                    type="number"
                                    name="width"
                                    value={formData.width}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    <input
                                        type="checkbox"
                                        name="sun_icon"
                                        checked={formData.sun_icon}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Sun Icon
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    <input
                                        type="checkbox"
                                        name="edible_icon"
                                        checked={formData.edible_icon}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Edible Icon
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    <input
                                        type="checkbox"
                                        name="partial_shade_icon"
                                        checked={formData.partial_shade_icon}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Partial Shade Icon
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    <input
                                        type="checkbox"
                                        name="blooming_time_icon"
                                        checked={formData.blooming_time_icon}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Blooming Time Icon
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    <input
                                        type="checkbox"
                                        name="pruning_icon"
                                        checked={formData.pruning_icon}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Pruning Icon
                                </label>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    <input
                                        type="checkbox"
                                        name="winter_hardy_icon"
                                        checked={formData.winter_hardy_icon}
                                        onChange={handleChange}
                                        className="mr-2"
                                    />
                                    Winter Hardy Icon
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Create Product
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
