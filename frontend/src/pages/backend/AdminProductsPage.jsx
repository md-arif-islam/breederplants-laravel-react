import { Leaf } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageTitleContext } from "../../context/PageTitleContext";
import { useProductStore } from "../../store/useProductStore";

// LazyImage component for lazy loading with a skeleton placeholder
function LazyImage({ src, alt, className }) {
    const [imgLoaded, setImgLoaded] = useState(false);
    return (
        <div className="relative w-20 h-20">
            {/* Placeholder skeleton while image is loading */}
            {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <Leaf className="w-8 h-8 text-gray-500 animate-pulse" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                className={`${className} transition-opacity duration-300 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
        </div>
    );
}

export default function AdminProductsPage() {
    // Track local input state
    const [searchQuery, setSearchQuery] = useState("");

    const { getAllProducts, isLoading, currentPage, totalPages, products } =
        useProductStore();

    const navigate = useNavigate();
    const { setTitle } = useContext(PageTitleContext);

    useEffect(() => {
        document.title = "Products - Breederplants";
        setTitle("Products");
    }, [setTitle]);

    // Fetch all products on mount (or whenever currentPage changes).
    useEffect(() => {
        // By default, pass the current searchQuery
        getAllProducts(currentPage, searchQuery);
    }, [getAllProducts, currentPage, searchQuery]);

    const handlePageChange = (page) => {
        getAllProducts(page, searchQuery);
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search input */}
                    <div className="flex-1">
                        <input
                            type="search"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="max-w-md w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => navigate("/admin/products/create")}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Add Product
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
                                    <th className="px-4 py-5 border-b text-left text-white font-semibold">
                                        Plant ID
                                    </th>
                                    <th className="px-4 py-5 border-b text-left text-white font-semibold">
                                        Genus
                                    </th>
                                    <th className="px-4 py-5 border-b text-left text-white font-semibold">
                                        Species
                                    </th>
                                    <th className="px-4 py-5 border-b text-left text-white font-semibold">
                                        Cultivar
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td
                                            colSpan={7}
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
                                        {!isLoading &&
                                            products?.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="text-center py-4 bg-red-100 p-5 rounded-md"
                                                    >
                                                        No products found.
                                                    </td>
                                                </tr>
                                            )}
                                        {products?.map((product) => {
                                            // Determine product image source
                                            const productImage =
                                                product.images &&
                                                JSON.parse(product.images)[0]
                                                    ? `${
                                                          import.meta.env
                                                              .VITE_API_URL
                                                      }/${
                                                          JSON.parse(
                                                              product.images
                                                          )[0]
                                                      }`
                                                    : "/placeholder.svg";
                                            return (
                                                <tr
                                                    key={product.id}
                                                    className="hover:bg-gray-50 cursor-pointer"
                                                    onClick={() =>
                                                        navigate(
                                                            `/admin/products/${product.id}`
                                                        )
                                                    }
                                                >
                                                    <td className="px-4 py-2 text-primary font-semibold border-b">
                                                        <LazyImage
                                                            src={productImage}
                                                            alt={product.name}
                                                            className="w-20 h-20 object-cover rounded"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-5 text-primary font-semibold border-b">
                                                        {product.plant_id}
                                                    </td>
                                                    <td className="px-4 py-5 text-[#353535] border-b">
                                                        {product.genus}
                                                    </td>
                                                    <td className="px-4 py-5 text-[#353535] border-b">
                                                        {product.species}
                                                    </td>
                                                    <td className="px-4 py-5 text-[#353535] border-b">
                                                        {product.cultivar}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                {products?.length > 0 && (
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
