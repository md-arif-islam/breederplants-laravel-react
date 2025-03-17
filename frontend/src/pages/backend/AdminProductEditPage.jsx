import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Leaf, Loader2, X } from "lucide-react";
import { useProductStore } from "../../store/useProductStore";

export default function AdminProductEditPage() {
    const { currentProduct, isLoading, getProduct, updateProduct } =
        useProductStore();
    const { id } = useParams();
    const navigate = useNavigate();

    // Initial state without removed fields and with new ones (images, description)
    const [formData, setFormData] = useState({
        genus: "",
        species: "",
        cultivar: "",
        description: "",
        plant_id: "",
        protection_number: "",
        cpvo_expiration_date: "",
        royalty_fee: "",
        sun_icon: false,
        edible_icon: false,
        partial_shade_icon: false,
        blooming_period: "",
        pruning_period: "",
        temperature: "",
        height: "",
        width: "",
        images: [],
    });

    // Local state for image previews.
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loadedImages, setLoadedImages] = useState({});

    useEffect(() => {
        document.title = "Edit Product - Breederplants";
    }, []);

    useEffect(() => {
        getProduct(id);
    }, [getProduct, id]);

    useEffect(() => {
        if (currentProduct) {
            const images = JSON.parse(currentProduct.images || "[]");
            setFormData((prev) => ({
                ...prev,
                images: images,
                genus: currentProduct.genus || "",
                species: currentProduct.species || "",
                cultivar: currentProduct.cultivar || "",
                description: currentProduct.description || "",
                plant_id: currentProduct.plant_id || "",
                protection_number: currentProduct.protection_number || "",
                cpvo_expiration_date: currentProduct.cpvo_expiration_date || "",
                royalty_fee: currentProduct.royalty_fee || "",
                sun_icon: currentProduct.sun_icon || false,
                edible_icon: currentProduct.edible_icon || false,
                partial_shade_icon: currentProduct.partial_shade_icon || false,
                blooming_period: currentProduct.blooming_period || "",
                pruning_period: currentProduct.pruning_period || "",
                temperature: currentProduct.temperature || "",
                height: currentProduct.height || "",
                width: currentProduct.width || "",
            }));
            setImagePreviews(images);
        }
    }, [currentProduct]);

    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });

    const handleNewImage = async (e) => {
        const files = Array.from(e.target.files);
        try {
            const base64Images = await Promise.all(files.map(fileToBase64));
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...base64Images],
            }));
            setImagePreviews((prev) => [...prev, ...base64Images]);
        } catch (err) {
            console.error("Error converting files to base64", err);
        }
    };

    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
        // Optionally, remove load status for that image too
        setLoadedImages((prev) => {
            const updated = { ...prev };
            delete updated[index];
            return updated;
        });
    };

    const handleImgLoad = (index) => {
        setLoadedImages((prev) => ({ ...prev, [index]: true }));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log(formData);

        const response = await updateProduct(id, formData);
        if (response.status === 200) {
            navigate(`/admin/products/${id}`);
        }
    };

    if (!currentProduct || isLoading) {
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
                    <form
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                        className="space-y-4"
                    >
                        {/* Images Section */}
                        <div className="mb-4 lg:mb-8">
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                {imagePreviews.map((image, index) => (
                                    <div key={index} className="relative">
                                        {!loadedImages[index] && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                                                <Leaf className="h-5 w-5 text-gray-400 animate-pulse" />
                                            </div>
                                        )}
                                        <img
                                            src={
                                                image.startsWith("data:")
                                                    ? image
                                                    : `${
                                                          import.meta.env
                                                              .VITE_API_URL
                                                      }/${image}`
                                            }
                                            alt={`Image ${index}`}
                                            className="w-full h-32 md:h-40 lg:h-60 object-cover rounded-lg"
                                            onLoad={() => handleImgLoad(index)}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                                <label className="flex items-center justify-center h-32 md:h-40 lg:h-60 border-2 border-dashed rounded-lg cursor-pointer hover:border-green-500">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleNewImage}
                                    />
                                    <span className="text-gray-500 text-sm">
                                        Add Images
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* First Column */}
                            <div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Genus{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="genus"
                                        value={formData.genus}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Species{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="species"
                                        value={formData.species}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
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
                                {/* Description field placed after cultivar */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        rows="3"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Plant ID
                                    </label>
                                    <input
                                        type="text"
                                        name="plant_id"
                                        value={formData.plant_id}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        Protection Number
                                    </label>
                                    <input
                                        type="text"
                                        name="protection_number"
                                        value={formData.protection_number}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-1">
                                        CPVO Expiration Date
                                    </label>
                                    <input
                                        type="date"
                                        name="cpvo_expiration_date"
                                        value={
                                            formData.cpvo_expiration_date || ""
                                        }
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                            </div>

                            {/* Second Column */}
                            <div>
                                <div className="mb-4">
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
                                <div className="mb-4 flex items-center space-x-2">
                                    <label className="mr-2 flex items-center">
                                        <input
                                            type="checkbox"
                                            name="sun_icon"
                                            checked={formData.sun_icon}
                                            onChange={handleChange}
                                            className="mr-1"
                                        />
                                        Sun Icon
                                    </label>
                                    <label className="mr-2 flex items-center">
                                        <input
                                            type="checkbox"
                                            name="edible_icon"
                                            checked={formData.edible_icon}
                                            onChange={handleChange}
                                            className="mr-1"
                                        />
                                        Edible Icon
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="partial_shade_icon"
                                            checked={
                                                formData.partial_shade_icon
                                            }
                                            onChange={handleChange}
                                            className="mr-1"
                                        />
                                        Partial Shade Icon
                                    </label>
                                </div>
                                <div className="mb-4">
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
                                <div className="mb-4">
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
                                <div className="mb-4">
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
                                <div className="mb-4">
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
                                <div className="mb-4">
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
