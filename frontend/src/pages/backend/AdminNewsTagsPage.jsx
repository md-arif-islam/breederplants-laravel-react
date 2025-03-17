import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { usePostStore } from "../../store/usePostStore";
import { toast } from "react-hot-toast";

export default function AdminNewsTagsPage() {
    useEffect(() => {
        document.title = "Admin News Tags - Breederplants";
    }, []);

    const [searchQuery, setSearchQuery] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
    const [name, setName] = useState("");
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [tagIdToDelete, setTagIdToDelete] = useState(null);

    // new states
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTagToEdit, setSelectedTagToEdit] = useState(null);

    const { isLoading, tags, getAllTags, createTag, updateTag, deleteTag } =
        usePostStore();

    const navigate = useNavigate();

    useEffect(() => {
        getAllTags();
    }, [getAllTags]);

    const openAddModal = () => {
        setShowAddModal(true);
    };

    const closeAddModal = () => {
        setShowAddModal(false);
        setSelectedTag(null);
        setName("");
    };

    const handleAddTag = async (e) => {
        e.preventDefault();

        if (!name) {
            alert("Please fill in all fields.");
            return;
        }

        const data = {
            name: name,
        };

        try {
            await createTag(data);
            getAllTags();
            closeAddModal();
            toast.success("Tag created successfully!");
        } catch (error) {
            console.error("Failed to create tag:", error);
            toast.error(error?.response?.data?.message || "Error creating tag");
        }
    };

    const confirmDeleteTag = (tagId) => {
        setTagIdToDelete(tagId);
        setShowConfirmationModal(true);
    };

    const cancelDelete = () => {
        setShowConfirmationModal(false);
        setTagIdToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await deleteTag(tagIdToDelete);
            getAllTags();
            toast.success("Tag deleted successfully!");
        } catch (error) {
            console.error("Failed to delete tag:", error);
            toast.error(error?.response?.data?.message || "Error deleting tag");
        } finally {
            setShowConfirmationModal(false);
            setTagIdToDelete(null);
        }
    };

    // edit functions
    const openEditModal = (tag) => {
        setSelectedTagToEdit(tag);
        setName(tag.name);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setSelectedTagToEdit(null);
        setName("");
    };

    const handleEditTag = async (e) => {
        e.preventDefault();
        if (!name) {
            alert("Please fill in all fields.");
            return;
        }

        const data = {
            name: name,
        };

        try {
            await updateTag(selectedTagToEdit.id, data);
            getAllTags();
            closeEditModal();
            toast.success("Tag updated successfully!");
        } catch (error) {
            console.error("Failed to update tag:", error);
            toast.error(error?.response?.data?.message || "Error updating tag");
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
                            Add Tag
                        </button>
                    </div>
                </div>

                <div className="rounded-md border bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto shadow rounded overflow-hidden">
                            <thead>
                                <tr className="bg-green-600 h-16 rounded-md shadow">
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Name
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Slug
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
                                            colSpan={3}
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
                                        {!isLoading && tags?.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={3}
                                                    className="text-center py-4 bg-red-100 p-5 rounded-md"
                                                >
                                                    No Tags found.
                                                </td>
                                            </tr>
                                        )}
                                        {tags?.map((tag) => (
                                            <tr
                                                key={tag.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-2 text-primary font-medium border-b">
                                                    {tag.name}
                                                </td>
                                                <td className="px-4 py-2 text-[#353535] border-b">
                                                    {tag.slug}
                                                </td>
                                                <td className="px-4 py-2 text-[#353535] border-b ">
                                                    <div className="flex gap-2">
                                                        <button
                                                            className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md bg-yellow-50 hover:bg-gray-50"
                                                            onClick={() =>
                                                                openEditModal(
                                                                    tag
                                                                )
                                                            }
                                                        >
                                                            <Pencil className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </button>

                                                        <button
                                                            className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md bg-red-50 hover:bg-gray-50"
                                                            onClick={() =>
                                                                confirmDeleteTag(
                                                                    tag.id
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

                {showConfirmationModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <p>Are you sure you want to delete this tag?</p>
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
                                        Add Tag
                                    </h2>
                                    <button
                                        onClick={closeAddModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleAddTag}>
                                    <div className="mb-6 space-y-3">
                                        <div>
                                            <label className="block text-base font-medium mb-3">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Add Tag
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
                                        Edit Tag
                                    </h2>
                                    <button
                                        onClick={closeEditModal}
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <form onSubmit={handleEditTag}>
                                    <div className="mb-6">
                                        <div>
                                            <label className="block text-base font-medium mb-3">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        Update Tag
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
