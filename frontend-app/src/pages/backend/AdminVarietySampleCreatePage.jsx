import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useVarietySampleStore } from "../../store/useVarietySampleStore";

export default function VarietySampleCreatePage() {
    const { isLoading, createVarietySample } = useVarietySampleStore();
    const { id } = useParams();
    const navigate = useNavigate();

    // Empty initial state for creating a new sample.
    const [formData, setFormData] = useState({
        sample_date: "",
        leaf_color: "",
        amount_of_branches: "",
        flower_buds: "",
        branch_color: "",
        roots: "",
        flower_color: "",
        flower_petals: "",
        flowering_time: "",
        length_of_flowering: "",
        seeds: "no",
        seed_color: "",
        amount_of_seeds: "",
        status: "1",
        note: "",
        images: [],
    });

    // imagePreviews holds the display strings (base64 strings) for each image.
    const [imagePreviews, setImagePreviews] = useState([]);

    // Helper: Convert a file to a base64 string.
    const fileToBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });

    // When new images are selected, convert them to base64 and update state.
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

    // Remove an image at the given index.
    const removeImage = (index) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    // On form submit, create a FormData payload and call the store function.
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        // Append all fields except images.
        Object.keys(formData).forEach((key) => {
            if (key === "images") return;
            formDataToSend.append(key, formData[key]);
        });

        // Append images (base64 strings) as an array.
        formData.images.forEach((img) => {
            formDataToSend.append("images[]", img);
        });

        // Call the store method (which will send a POST request).
        const response = await createVarietySample(id, formDataToSend);
        if (response.status === 201) {
            navigate(`/admin/variety-reports/${id}`);
        }
    };

    useEffect(() => {
        // page title
        document.title = "Create Variety Sample - Breederplants";
    });

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-4">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        {/* Images Section */}
                        <div className="mb-4 lg:mb-8">
                            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2">
                                {imagePreviews.map((image, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={image}
                                            alt={`Image ${index}`}
                                            className="w-full h-32 md:h-40 lg:h-60 object-cover rounded-lg"
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

                        {/* Form Fields */}
                        <div className="grid gap-4 md:grid-cols-2">
                            {/* First Column */}
                            <div className="space-y-2 lg:space-y-4">
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Sample Date
                                    </label>
                                    <input
                                        type="date"
                                        name="sample_date"
                                        value={formData.sample_date}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                sample_date: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Leaf Color
                                    </label>
                                    <select
                                        name="leaf_color"
                                        value={formData.leaf_color}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                leaf_color: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    >
                                        <option value="">
                                            Select Leaf Color
                                        </option>
                                        <option value="green">Green</option>
                                        <option value="red">Red</option>
                                        <option value="variegated_yellow">
                                            Variegated Yellow
                                        </option>
                                        <option value="variegated_white">
                                            Variegated White
                                        </option>
                                        <option value="yellow">Yellow</option>
                                        <option value="purple">Purple</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Amount of Branches
                                    </label>
                                    <select
                                        name="amount_of_branches"
                                        value={formData.amount_of_branches}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                amount_of_branches:
                                                    e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    >
                                        <option value="">
                                            Select Amount of Branches
                                        </option>
                                        {[...Array(10)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Flower Buds
                                    </label>
                                    <select
                                        name="flower_buds"
                                        value={formData.flower_buds}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                flower_buds: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    >
                                        <option value="">
                                            Select Flower Buds
                                        </option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Branch Color
                                    </label>
                                    <select
                                        name="branch_color"
                                        value={formData.branch_color}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                branch_color: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    >
                                        <option value="">
                                            Select Branch Color
                                        </option>
                                        <option value="brown">Brown</option>
                                        <option value="green">Green</option>
                                        <option value="white">White</option>
                                        <option value="yellow">Yellow</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Roots
                                    </label>
                                    <select
                                        name="roots"
                                        value={formData.roots}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                roots: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    >
                                        <option value="">Select Roots</option>
                                        <option value="weak">Weak</option>
                                        <option value="medium">Medium</option>
                                        <option value="good">Good</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Flower Color
                                    </label>
                                    <select
                                        name="flower_color"
                                        value={formData.flower_color}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                flower_color: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    >
                                        <option value="">
                                            Select Flower Color
                                        </option>
                                        <option value="white">White</option>
                                        <option value="blue">Blue</option>
                                        <option value="purple">Purple</option>
                                        <option value="yellow">Yellow</option>
                                        <option value="red">Red</option>
                                        <option value="green">Green</option>
                                        <option value="variegated_yellow">
                                            Variegated Yellow
                                        </option>
                                        <option value="variegated_white">
                                            Variegated White
                                        </option>
                                    </select>
                                </div>
                            </div>

                            {/* Second Column */}
                            <div className="space-y-2 lg:space-y-4">
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Flower Petals
                                    </label>
                                    <select
                                        name="flower_petals"
                                        value={formData.flower_petals}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                flower_petals: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    >
                                        <option value="">
                                            Select Flower Petals
                                        </option>
                                        {[...Array(99)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Flowering Time
                                    </label>
                                    <select
                                        name="flowering_time"
                                        value={formData.flowering_time}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                flowering_time: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    >
                                        <option value="">
                                            Select Flowering Time
                                        </option>
                                        <option value="January">January</option>
                                        <option value="February">
                                            February
                                        </option>
                                        <option value="March">March</option>
                                        <option value="April">April</option>
                                        <option value="May">May</option>
                                        <option value="June">June</option>
                                        <option value="July">July</option>
                                        <option value="August">August</option>
                                        <option value="September">
                                            September
                                        </option>
                                        <option value="October">October</option>
                                        <option value="November">
                                            November
                                        </option>
                                        <option value="December">
                                            December
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Length of Flowering
                                    </label>
                                    <select
                                        name="length_of_flowering"
                                        value={formData.length_of_flowering}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                length_of_flowering:
                                                    e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    >
                                        <option value="">
                                            Select Length of Flowering
                                        </option>
                                        {[...Array(99)].map((_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {i + 1} week
                                                {i + 1 > 1 ? "s" : ""}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Seeds
                                    </label>
                                    <select
                                        name="seeds"
                                        value={formData.seeds}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                seeds: e.target.value,
                                            })
                                        }
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    >
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                    </select>
                                </div>
                                {formData.seeds === "yes" && (
                                    <>
                                        <div>
                                            <label className="block text-sm md:text-sm font-medium text-gray-700">
                                                Seed Color
                                            </label>
                                            <select
                                                name="seed_color"
                                                value={formData.seed_color}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        seed_color:
                                                            e.target.value,
                                                    })
                                                }
                                                className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                            >
                                                <option value="">
                                                    Select Seed Color
                                                </option>
                                                <option value="white">
                                                    White
                                                </option>
                                                <option value="brown">
                                                    Brown
                                                </option>
                                                <option value="black">
                                                    Black
                                                </option>
                                                <option value="yellow">
                                                    Yellow
                                                </option>
                                                <option value="red">Red</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm md:text-sm font-medium text-gray-700">
                                                Amount of Seeds
                                            </label>
                                            <select
                                                name="amount_of_seeds"
                                                value={formData.amount_of_seeds}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        amount_of_seeds:
                                                            e.target.value,
                                                    })
                                                }
                                                className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                            >
                                                <option value="">
                                                    Select Amount
                                                </option>
                                                {[...Array(5)].map((_, i) => (
                                                    <option
                                                        key={i + 1}
                                                        value={i + 1}
                                                    >
                                                        {i + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm md:text-sm font-medium text-gray-700">
                                        Note
                                    </label>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                note: e.target.value,
                                            })
                                        }
                                        placeholder="Enter note"
                                        className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Status Field */}
                            <div className="mb-2 lg:mb-4">
                                <label className="block text-sm md:text-sm font-medium text-gray-700">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            status: e.target.value,
                                        })
                                    }
                                    className="mt-1 w-full px-2 py-1 md:px-3 md:py-2 bg-gray-50 border border-gray-300 rounded-md text-sm md:text-sm"
                                >
                                    <option value="1">Active</option>
                                    <option value="0">Inactive</option>
                                </select>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="border rounded-full p-2 mt-8">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full text-center align-middle h-12 rounded-full text-sm lg:text-lg bg-primary hover:bg-secondary text-white font-semibold transition-colors flex items-center justify-center"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                ) : (
                                    "Create Variety Sample"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
