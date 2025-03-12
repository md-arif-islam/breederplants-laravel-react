import { Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBreederProductStore } from "../../store/useBreederProductStore";
import { useProductStore } from "../../store/useProductStore";

export default function AdminBreederProductsPage() {
    useEffect(() => {
        document.title = "Admin Breeder Products - Breederplants";
    }, []);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);

    const {
        isLoading,
        breederProducts,
        currentPage,
        totalPages,
        getAllBreederProducts,
        deleteBreederProduct,
        createBreederProduct,
    } = useBreederProductStore();

    const { getAllProducts, products } = useProductStore();

    const { id: breederId } = useParams();

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    useEffect(() => {
        getAllBreederProducts(currentPage, searchQuery, breederId);
    }, [getAllBreederProducts, currentPage, searchQuery, breederId]);

    const handlePageChange = (page) => {
        getAllBreederProducts(page, searchQuery, breederId);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setSelectedProduct(null);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const data = {
            product_id: selectedProduct,
        };

        try {
            await createBreederProduct(breederId, data);
            getAllBreederProducts(currentPage, searchQuery, breederId);
            closeAddModal();
        } catch (error) {
            console.error("Failed to create breeder product:", error);
        }
    };

    const confirmDeleteProduct = (productId) => {
        setProductIdToDelete(productId);
        setShowConfirmationModal(true);
    };

    const cancelDelete = () => {
        setShowConfirmationModal(false);
        setProductIdToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await deleteBreederProduct(breederId, productIdToDelete);
            getAllBreederProducts(currentPage, searchQuery, breederId);
        } catch (error) {
            console.error("Failed to delete breeder product:", error);
        } finally {
            setShowConfirmationModal(false);
            setProductIdToDelete(null);
        }
    };

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                            onClick={openAddModal}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Add Product
                        </button>
                    </div>
                </div>

                <div className="rounded-md border bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto shadow rounded overflow-hidden">
                            <thead>
                                <tr className="bg-green-600 h-16 rounded-md shadow">
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Product Name
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Action
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
                                        {!isLoading &&
                                            breederProducts?.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="text-center py-4 bg-red-100 p-5 rounded-md"
                                                    >
                                                        No Products found.
                                                    </td>
                                                </tr>
                                            )}
                                        {breederProducts?.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-5 text-primary font-medium border-b">
                                                    {product.product.genus}{" "}
                                                    {product.product.cultivar}
                                                </td>

                                                <td className="px-4 py-2 text-[#353535] border-b ">
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md bg-red-50 hover:bg-gray-50"
                                                            onClick={() =>
                                                                confirmDeleteProduct(
                                                                    product.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {breederProducts?.length > 0 && (
                    <div className="flex justify-center mt-6">
                        <nav className="inline-flex rounded-md shadow-sm gap-2">
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

                {showConfirmationModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <p>Are you sure you want to delete this product?</p>
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                    onClick={handleDelete}
                                >
                                    Yes
                                </button>
                                <button
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                    onClick={cancelDelete}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {showAddModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">
                                        Add product to breeder
                                    </h2>
                                    <button
                                        onClick={closeAddModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleAddProduct}>
                                    <div className="mb-6 space-y-3">
                                        <div>
                                            <label className="block text-base font-medium mb-3">
                                                Product
                                            </label>
                                            <select
                                                name="product_id"
                                                value={selectedProduct || ""}
                                                onChange={(e) =>
                                                    setSelectedProduct(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            >
                                                <option value="">
                                                    Select Product
                                                </option>
                                                {products?.map((product) => (
                                                    <option
                                                        key={product.id}
                                                        value={product.id}
                                                    >
                                                        {product.genus}{" "}
                                                        {product.cultivar}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Add Product
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
