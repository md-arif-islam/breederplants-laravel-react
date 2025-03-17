"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { usePostStore } from "../../store/usePostStore";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    SingleSelect,
    MultiSelect,
} from "../../components/backend/MultiSelect";

export default function AdminNewsUpdatePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        isLoading,
        getPost,
        currentPost: post,
        updatePost,
        categories,
        getAllCategories,
        tags,
        getAllTags,
    } = usePostStore();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category_id: "",
        categories: [],
        tags: [],
        status: "1",
        thumbnail: null,
    });

    useEffect(() => {
        document.title = "Update News - Breederplants";
        getAllCategories();
        getAllTags();
        getPost(id);
    }, [id, getAllCategories, getAllTags, getPost]);

    useEffect(() => {
        if (post) {
            setFormData({
                title: post.title,
                description: post.description,
                category_id: post.category_id?.toString() || "",
                categories:
                    post.categories?.map((category) =>
                        category.id.toString()
                    ) || [],
                tags: post.tags?.map((tag) => tag.id.toString()) || [],
                status: post.status?.toString() || "1",
                thumbnail: post.thumbnail || null,
            });
        }
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updatePost(id, formData);
            if (res.status === 200) {
                toast.success("News updated successfully!");
                navigate("/admin/news");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const [loading, setLoading] = useState(false);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({
                    ...formData,
                    thumbnail: reader.result,
                });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Title{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                title: e.target.value,
                                            })
                                        }
                                        placeholder="Enter post title"
                                        className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        description{" "}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                description: e.target.value,
                                            })
                                        }
                                        placeholder="Enter news description"
                                        className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                                    ></textarea>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Thumbnail
                                    </label>
                                    <div className="mt-1 flex items-center gap-2">
                                        <label className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                                            Choose File
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files[0];
                                                    if (file) {
                                                        const reader =
                                                            new FileReader();
                                                        reader.onloadend =
                                                            () => {
                                                                setFormData({
                                                                    ...formData,
                                                                    thumbnail:
                                                                        reader.result,
                                                                });
                                                            };
                                                        reader.readAsDataURL(
                                                            file
                                                        );
                                                    }
                                                }}
                                            />
                                        </label>
                                        <span className="text-gray-500">
                                            {formData.thumbnail ? (
                                                <img
                                                    src={
                                                        typeof formData.thumbnail ===
                                                            "string" &&
                                                        formData.thumbnail.startsWith(
                                                            "data:"
                                                        )
                                                            ? formData.thumbnail
                                                            : `${
                                                                  import.meta
                                                                      .env
                                                                      .VITE_API_URL
                                                              }/${
                                                                  formData.thumbnail
                                                              }`
                                                    }
                                                    alt="Thumbnail Preview"
                                                    className="h-28 w-28 object-cover rounded-md"
                                                />
                                            ) : (
                                                "No file chosen"
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Category
                                    </label>
                                    <MultiSelect
                                        options={categories || []}
                                        value={formData.categories}
                                        onChange={(selectedCategories) =>
                                            setFormData({
                                                ...formData,
                                                categories: selectedCategories,
                                            })
                                        }
                                        placeholder="Select Tags"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tags
                                    </label>
                                    <MultiSelect
                                        options={tags || []}
                                        value={formData.tags}
                                        onChange={(selectedTags) =>
                                            setFormData({
                                                ...formData,
                                                tags: selectedTags,
                                            })
                                        }
                                        placeholder="Select Tags"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded h-10 bg-primary hover:bg-green-700 text-white transition-colors flex items-center justify-center"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update News"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}
