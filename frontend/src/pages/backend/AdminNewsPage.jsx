import { useEffect, useState } from "react";
import { usePostStore } from "../../store/usePostStore";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

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
        getAllTags, // added
        tags, // added
    } = usePostStore();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Admin News - Breederplants";
        getAllCategories(); // added: fetch categories
        getAllTags(); // added: fetch tags
    }, [getAllCategories, getAllTags]);

    useEffect(() => {
        // Pass additional parameters for category, tag and sort
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
                        {/* Category Filter */}
                        <select
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                            value={selectedCategory}
                            className="w-full md:w-[180px] px-3 py-2 rounded-md shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                        >
                            <option value="">Select category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {/* Tag Filter */}
                        <select
                            onChange={(e) => setSelectedTag(e.target.value)}
                            value={selectedTag}
                            className="w-full md:w-[180px] px-3 py-2 rounded-md shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                        >
                            <option value="">Select tag</option>
                            {tags.map((tag) => (
                                <option key={tag.id} value={tag.name}>
                                    {tag.name}
                                </option>
                            ))}
                        </select>
                        <select
                            name="sort"
                            className="w-full md:w-[180px] px-3 py-2 rounded-md shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                            onChange={(e) => setSort(e.target.value)}
                            value={sort}
                        >
                            <option value="">Select sort</option>
                            <option value="a-z">Grower name (A-Z)</option>
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
                            onClick={() =>
                                navigate("/admin/variety-reports/create")
                            }
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
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Title
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Category
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Tags
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
                                            colSpan={4}
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
                                                    colSpan={4}
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
                                                    className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                                    onClick={() => {
                                                        navigate(
                                                            `/admin/news/${post.id}`
                                                        );
                                                    }}
                                                >
                                                    <td className="px-4 py-2 border-b text-left">
                                                        {post.title}
                                                    </td>
                                                    <td className="px-4 py-2 border-b text-left">
                                                        {post.categories?.map(
                                                            (category) => (
                                                                <span
                                                                    key={
                                                                        category.id
                                                                    }
                                                                    className="bg-green-600 text-white px-2 py-1 rounded-md mr-1"
                                                                >
                                                                    {
                                                                        category.name
                                                                    }
                                                                </span>
                                                            )
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 border-b text-left">
                                                        {post.tags?.map(
                                                            (tag) => (
                                                                <span
                                                                    key={tag.id}
                                                                    className="bg-green-600 text-white px-2 py-1 rounded-md mr-1"
                                                                >
                                                                    {tag.name}
                                                                </span>
                                                            )
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-2 border-b text-left">
                                                        {format(
                                                            new Date(
                                                                post.created_at
                                                            ),
                                                            "dd - mm - yyyy"
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
