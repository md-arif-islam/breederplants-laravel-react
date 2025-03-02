import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useGrowerProductStore } from "../../store/useGrowerProductStore";
import { useProductStore } from "../../store/useProductStore";

export default function AdminGrowerProductsPage() {
    useEffect(() => {
        document.title = "Admin Grower Products - Breederplants";
    }, []);
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [unitPrice, setUnitPrice] = useState("");
    const [stock, setStock] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [productIdToDelete, setProductIdToDelete] = useState(null);

    // new states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddQuantityModal, setShowAddQuantityModal] = useState(false);
    const [selectedGrowerProduct, setSelectedGrowerProduct] = useState(null);
    const [newQuantity, setNewQuantity] = useState("");

    const {
        isLoading,
        growerProducts,
        currentPage,
        totalPages,
        getAllGrowerProducts,
        deleteGrowerProduct,
        createGrowerProduct,
        updateGrowerProduct,
        addQuantityToStock,
    } = useGrowerProductStore();

    const { getAllProducts, products } = useProductStore();

    const { id: growerId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getAllProducts();
    }, [getAllProducts]);

    useEffect(() => {
        getAllGrowerProducts(currentPage, searchQuery, growerId);
    }, [getAllGrowerProducts, currentPage, searchQuery, growerId]);

    const handlePageChange = (page) => {
        getAllGrowerProducts(page, searchQuery, growerId);
    };

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setSelectedProduct(null);
        setUnitPrice("");
        setStock("");
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (!selectedProduct || !unitPrice || !stock) {
            alert("Please fill in all fields.");
            return;
        }

        const data = {
            product_id: selectedProduct,
            unit_price: parseFloat(unitPrice),
            stock: parseInt(stock),
        };

        try {
            await createGrowerProduct(growerId, data);
            getAllGrowerProducts(currentPage, searchQuery, growerId);
            closeAddModal();
        } catch (error) {
            console.error("Failed to create grower product:", error);
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
            await deleteGrowerProduct(growerId, productIdToDelete);
            getAllGrowerProducts(currentPage, searchQuery, growerId);
        } catch (error) {
            console.error("Failed to delete grower product:", error);
        } finally {
            setShowConfirmationModal(false);
            setProductIdToDelete(null);
        }
    };

    // edit functions
    const openEditModal = (product) => {
        setSelectedGrowerProduct(product);
        setUnitPrice(product.unit_price);
        setStock(product.stock);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedGrowerProduct(null);
        setUnitPrice("");
        setStock("");
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        if (!unitPrice || !stock) {
            alert("Please fill in all fields.");
            return;
        }

        const data = {
            unit_price: parseFloat(unitPrice),
            stock: parseInt(stock),
        };

        try {
            await updateGrowerProduct(growerId, selectedGrowerProduct.id, data);
            getAllGrowerProducts(currentPage, searchQuery, growerId);
            closeEditModal();
        } catch (error) {
            console.error("Failed to update grower product:", error);
        }
    };

    // add quantity functions
    const openAddQuantityModal = (product) => {
        setSelectedGrowerProduct(product);
        setNewQuantity("");
        setShowAddQuantityModal(true);
    };

    const closeAddQuantityModal = () => {
        setShowAddQuantityModal(false);
        setSelectedGrowerProduct(null);
        setNewQuantity("");
    };

    const handleAddQuantity = async (e) => {
        e.preventDefault();
        if (!newQuantity) {
            alert("Please fill in the quantity field.");
            return;
        }

        try {
            const res = await addQuantityToStock(
                growerId,
                selectedGrowerProduct.id,
                newQuantity
            );

            getAllGrowerProducts(currentPage, searchQuery, growerId);
            closeAddQuantityModal();
        } catch (error) {
            console.error("Failed to add quantity:", error);
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
                                        Unit Price
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Stock
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
                                            growerProducts?.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="text-center py-4 bg-red-100 p-5 rounded-md"
                                                    >
                                                        No Products found.
                                                    </td>
                                                </tr>
                                            )}
                                        {growerProducts?.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-5 text-primary font-medium border-b">
                                                    {product.product.genus}{" "}
                                                    {product.product.cultivar}
                                                </td>
                                                <td className="px-4 py-2 text-[#353535] border-b">
                                                    {product.unit_price}
                                                </td>
                                                <td className="px-4 py-2 text-[#353535] border-b">
                                                    {product.stock}
                                                </td>
                                                <td className="px-4 py-2 text-[#353535] border-b ">
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md bg-green-50 hover:bg-gray-50"
                                                            onClick={() =>
                                                                openAddQuantityModal(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            <Plus className="mr-2 h-4 w-4" />
                                                            Add Quantity
                                                        </button>
                                                        <button
                                                            className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md bg-yellow-50 hover:bg-gray-50"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </button>

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

                {growerProducts?.length > 0 && (
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
                                        Add product to grower
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

                                        <div>
                                            <label className="block text-base font-medium mb-3">
                                                Royalty Fee{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                                <p className="font-normal text-sm text-gray-500">
                                                    Royalty Fee of the product.
                                                </p>
                                            </label>
                                            <input
                                                type="number"
                                                value={unitPrice}
                                                step={0.01}
                                                onChange={(e) =>
                                                    setUnitPrice(e.target.value)
                                                }
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-base font-medium mb-3">
                                                Stock{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                value={stock}
                                                onChange={(e) =>
                                                    setStock(e.target.value)
                                                }
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                            />
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

                {/* Edit Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">
                                        Edit Grower Product
                                    </h2>
                                    <button
                                        onClick={closeEditModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleEditProduct}>
                                    <div className="mb-6">
                                        <div>
                                            <label className="block text-base font-medium mb-3">
                                                Unit Price{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                value={unitPrice}
                                                step={0.01}
                                                onChange={(e) =>
                                                    setUnitPrice(e.target.value)
                                                }
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-base font-medium mb-3">
                                                Stock{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                value={stock}
                                                onChange={(e) =>
                                                    setStock(e.target.value)
                                                }
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Update Product
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add Quantity Modal */}
                {showAddQuantityModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-semibold">
                                        Add Quantity
                                    </h2>
                                    <button
                                        onClick={closeAddQuantityModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleAddQuantity}>
                                    <div className="mb-6">
                                        <div>
                                            <label className="block text-base font-medium mb-3">
                                                Quantity to Add{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </label>
                                            <input
                                                type="number"
                                                value={newQuantity}
                                                onChange={(e) =>
                                                    setNewQuantity(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Add Quantity
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
