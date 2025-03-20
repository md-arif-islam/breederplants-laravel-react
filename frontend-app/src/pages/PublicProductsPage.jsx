import React, { useContext, useEffect, useState } from "react";
import { useProductStore } from "../store/useProductStore";
import ProductCard from "../components/ProductCard";
import { PageTitleContext } from "../context/PageTitleContext";

function VarietyReportCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-2 flex items-center gap-4 mb-4 drop-shadow-md animate-pulse">
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36 flex-shrink-0 bg-gray-300 rounded-xl"></div>
            <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
        </div>
    );
}

const PublicProductsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { setTitle } = useContext(PageTitleContext);

    const { isLoading, products, currentPage, totalPages, getAllProducts } =
        useProductStore();

    useEffect(() => {
        getAllProducts(currentPage, searchQuery);
    }, [currentPage, searchQuery, getAllProducts]);

    useEffect(() => {
        document.title = "Products - Breederplants";
        setTitle("Catalog");
    }, [setTitle]);

    const handlePageChange = (page) => {
        getAllProducts(page, searchQuery);
    };

    return (
        <div className="bg-gray-50 -mt-12 ">
            {/* Content */}
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="min-h-screen bg-white rounded-t-3xl p-4 lg:p-6">
                        <div className="mb-6">
                            <div className="relative max-w-md mx-auto">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-1 lg:gap-4">
                            {isLoading
                                ? Array.from({ length: 2 }).map((_, idx) => (
                                      <VarietyReportCardSkeleton key={idx} />
                                  ))
                                : products?.map((product) => (
                                      <ProductCard
                                          key={product.id}
                                          product={product}
                                      />
                                  ))}
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

export default PublicProductsPage;
