import { useEffect, useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import { useNavigate } from "react-router-dom";
import { Leaf } from "lucide-react";
import { formatDate } from "../../utils/formatDate.js";

// LazyImage component for lazy loading images with a skeleton placeholder
function LazyImage({ src, alt, className }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    return (
        <div className="relative w-20 h-20 rounded-md overflow-hidden">
            {/* Display a placeholder while the image is loading */}
            {!imgLoaded && (
                <div className="absolute rounded inset-0 flex items-center justify-center bg-gray-200">
                    <Leaf className="w-8 h-8 text-gray-500 animate-pulse" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                className={`object-cover w-20 h-20  transition-opacity duration-300  ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
        </div>
    );
}

export default function AdminNewsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedTag, setSelectedTag] = useState("");
    const [sort, setSort] = useState("");

    const {
        getAllPosts,
        isLoading,
        posts,
        currentPage,
        totalPages,
        categories,
        getAllCategories,
        getAllTags,
        tags,
    } = usePostStore();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Admin News - Breederplants";
        getAllCategories();
        getAllTags();
    }, [getAllCategories, getAllTags]);

    useEffect(() => {
        getAllPosts(
            currentPage,
            searchQuery,
            selectedCategory,
            selectedTag,
            sort
        );
    }, [
        getAllPosts,
        currentPage,
        searchQuery,
        selectedCategory,
        selectedTag,
        sort,
    ]);

    const handlePageChange = (page) => {
        getAllPosts(page, searchQuery, selectedCategory, selectedTag, sort);
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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 grid gap-4 md:flex md:items-center md:justify-between">
                    <div className="grid gap-4 md:flex md:flex-1 md:items-center md:gap-4">
                        <input
                            type="search"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:max-w-[300px] px-3 py-2 rounded-md shadow-sm border border-gray-300 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                        />

                        <select
                            name="sort"
                            className="w-full md:w-[180px] px-3 py-2 rounded-md shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                            onChange={(e) => setSort(e.target.value)}
                            value={sort}
                        >
                            <option value="">Select sort</option>
                            <option value="a-z">News Title (A-Z)</option>
                            <option value="last-item-first">
                                Last item first
                            </option>
                            <option value="first-item-last">
                                First item last
                            </option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/admin/news/create")}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Create News
                        </button>
                    </div>
                </div>

                {/* TABLE */}
                <div className="rounded-md border bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto shadow rounded overflow-hidden">
                            <thead>
                                <tr className="bg-green-600 h-16 rounded-md shadow">
                                    <th className="px-4 py-5 border-b text-left text-white font-semibold">
                                        Thumbnail
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Title
                                    </th>

                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Created At
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="text-center py-4"
                                        >
                                            <div className="animate-pulse">
                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
                                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {!isLoading && posts?.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="text-center py-4 bg-red-100 p-5 rounded-md"
                                                >
                                                    No news found.
                                                </td>
                                            </tr>
                                        )}
                                        {!isLoading &&
                                            posts?.map((post) => (
                                                <tr
                                                    key={post.id}
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/news/${post.id}`
                                                        )
                                                    }
                                                >
                                                    <td className="px-4 py-2 text-primary font-semibold border-b">
                                                        <LazyImage
                                                            src={`${
                                                                import.meta.env
                                                                    .VITE_API_URL
                                                            }/${
                                                                post.thumbnail
                                                            }`}
                                                            alt={post.title}
                                                            className="w-20 h-20 object-cover rounded"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 border-b text-left">
                                                        {post.title}
                                                    </td>

                                                    <td className="px-4 py-2 border-b text-left">
                                                        {getFormattedDate(
                                                            post.created_at
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
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
                                    onClick={() => handlePageChange(page)}
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
        </main>
    );
}
