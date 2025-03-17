import React, { useEffect, useState } from "react";
import { Leaf, Pencil, Trash2 } from "lucide-react";
import { usePostStore } from "../../store/usePostStore";
import { useNavigate, useParams } from "react-router-dom";
// ...existing imports...

export default function AdminNewsViewPage() {
    const { currentPost, isLoading, getPost, deletePost } = usePostStore();
    const [showPopup, setShowPopup] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getPost(id);
    }, [getPost, id]);

    useEffect(() => {
        document.title = "News View - Breederplants";
    }, []);

    const handleDelete = async (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        setShowPopup(false);
        const response = await deletePost(id);
        if (response && response.status === 200) {
            navigate(`/admin/news`);
        }
    };

    const cancelDelete = () => {
        setShowPopup(false);
    };

    const thumbnailUrl = currentPost?.thumbnail
        ? `${import.meta.env.VITE_API_URL}/${currentPost.thumbnail}`
        : "/placeholder.svg";

    if (isLoading || !currentPost) {
        return (
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
                <div className="container mx-auto px-4 py-8">
                    {/* ...existing loading indicator... */}
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="block space-y-4 md:space-y-0 md:grid gap-8 md:grid-cols-[300px,1fr]">
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                        {/* Show placeholder until image loads */}
                        {!imgLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                <Leaf className="w-8 h-8 text-gray-400 animate-pulse" />
                            </div>
                        )}
                        <img
                            src={thumbnailUrl}
                            alt={currentPost.title}
                            loading="lazy"
                            onLoad={() => setImgLoaded(true)}
                            className={`w-full h-full object-cover rounded-lg mt-3 transition-opacity duration-300 ${
                                imgLoaded ? "opacity-100" : "opacity-0"
                            }`}
                        />
                    </div>
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <div className="">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {currentPost.title}
                                </h2>
                                <iframe
                                    srcDoc={currentPost.description}
                                    title="News Description"
                                    className="mt-4 w-full h-96 border rounded" // Adjust height as needed
                                />
                            </div>

                            <div className="pt-4">
                                <h3 className="text-lg font-medium">
                                    Categories
                                </h3>
                                <div className="mt-2">
                                    {currentPost.categories &&
                                    currentPost.categories.length > 0 ? (
                                        currentPost.categories.map((cat) => (
                                            <span
                                                key={cat.id}
                                                className="inline-block bg-green-600 text-white text-xs font-bold rounded-full px-2 py-1 mr-1"
                                            >
                                                {cat.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-sm">
                                            No categories
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4">
                                <h3 className="text-lg font-medium ">Tags</h3>
                                <div className="mt-2">
                                    {currentPost.tags &&
                                    currentPost.tags.length > 0 ? (
                                        currentPost.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="inline-block bg-blue-600 text-white text-xs font-bold rounded-full px-2 py-1 mr-1"
                                            >
                                                {tag.name}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-gray-500 text-sm">
                                            No tags
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 mt-8">
                                <button
                                    onClick={() =>
                                        navigate(`/admin/news/${id}/edit`)
                                    }
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <p>Are you sure you want to delete this post?</p>
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
        </main>
    );
}
