import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usePostStore } from "../store/usePostStore";
import PostCard from "../components/PostCard";

const PublicTagsPage = () => {
    const { slug } = useParams();
    const { isLoading, posts, currentPage, totalPages, getPostsByTag } =
        usePostStore();
    const [tagName, setTagName] = useState("");

    useEffect(() => {
        getPostsByTag(slug, currentPage);
        setTagName(slug);
    }, [slug, currentPage, getPostsByTag]);

    useEffect(() => {
        document.title = `Tag: ${tagName} - Breederplants`;
    }, [tagName]);

    const handlePageChange = (page) => {
        getPostsByTag(slug, page);
    };

    return (
        <div className="bg-gray-50 -mt-12 ">
            {/* Content */}
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="min-h-screen bg-white rounded-t-3xl p-4 lg:p-6">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold mb-4">
                                Tag: {tagName}
                            </h1>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-4">
                            {posts?.map((post) => (
                                <PostCard key={post.id} post={post} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {posts?.length > 0 && (
                            <div className="flex justify-center mt-6">
                                <nav className="inline-flex rounded-md shadow-sm gap-2">
                                    {/* Previous Button */}
                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage - 1)
                                        }
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-l-md hover:bg-gray-50 ${
                                            currentPage === 1
                                                ? "cursor-not-allowed opacity-50"
                                                : ""
                                        }`}
                                    >
                                        Previous
                                    </button>

                                    {/* Page Numbers */}
                                    {Array.from(
                                        { length: totalPages },
                                        (_, i) => i + 1
                                    ).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() =>
                                                handlePageChange(page)
                                            }
                                            className={`px-4 py-2 text-sm font-medium ${
                                                currentPage === page
                                                    ? "bg-green-600 text-white"
                                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                            } border border-gray-300`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    {/* Next Button */}
                                    <button
                                        onClick={() =>
                                            handlePageChange(currentPage + 1)
                                        }
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-r-md hover:bg-gray-50 ${
                                            currentPage === totalPages
                                                ? "cursor-not-allowed opacity-50"
                                                : ""
                                        }`}
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicTagsPage;
