import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImportBreederModal } from "../../components/backend/ImportBreederModal";
import { useStore } from "../../store/useStore";

export default function AdminBreederPage() {
    // Track local input state
    const [searchQuery, setSearchQuery] = useState("");
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const {
        getAllBreeders,
        isLoading,
        breeders,
        currentPage,
        totalPages,
        exportCSVBreeders,
        importCSVBreeders,
    } = useStore();

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Breeders - Breederplants";
    }, []);

    // Fetch all breeders on mount (or whenever currentPage changes).
    useEffect(() => {
        // By default, pass the current searchQuery
        getAllBreeders(currentPage, searchQuery);
    }, [getAllBreeders, currentPage, searchQuery]);

    const handlePageChange = (page) => {
        getAllBreeders(page, searchQuery);
    };

    const handleImport = async (file) => {
        try {
            const response = await importCSVBreeders(file);
            setImportResult({
                success: true,
                message: `Imported ${response.data.success_count} successfully, ${response.data.failed_count} failed.`,
                failedDetails: response.data.failed_details || [],
            });
            setIsImportModalOpen(false);
            // Refresh breeders list
            getAllBreeders(currentPage, searchQuery);
        } catch (error) {
            const failedDetails = error?.response?.data?.failed_details || [];

            setImportResult({
                success: false,
                message: "Import failed.",
                failedDetails,
            });

            setIsImportModalOpen(false);
            getAllBreeders(currentPage, searchQuery);
        }
    };

    const handleExportCSV = async () => {
        setIsExporting(true);
        try {
            await exportCSVBreeders();
        } catch (error) {
            console.error("Export failed:", error);
        } finally {
            setIsExporting(false);
        }
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
                            onClick={() => navigate("/admin/breeders/create")}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Add Breeder
                        </button>
                        <button
                            onClick={handleExportCSV}
                            disabled={isExporting}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            {isExporting ? (
                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                                "Export CSV"
                            )}
                        </button>
                        <button
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                            onClick={() => setIsImportModalOpen(true)}
                        >
                            Import CSV
                        </button>
                    </div>
                </div>

                {importResult && (
                    <div
                        className={`p-4 mb-4 rounded-md ${
                            importResult.success
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                        }`}
                    >
                        <p className="font-medium">{importResult.message}</p>
                        {importResult.failedDetails.length > 0 && (
                            <ul className="mt-2 list-disc list-inside text-sm">
                                {importResult.failedDetails.map(
                                    (fail, index) => (
                                        <li key={index}>
                                            Row {fail.row}: {fail.reason}
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </div>
                )}

                {/* TABLE */}
                <div className="rounded-md border bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto shadow rounded overflow-hidden">
                            <thead>
                                <tr className="bg-green-600 h-16 rounded-md shadow">
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Username
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Contact Person
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Company Email
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Company
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Phone
                                    </th>
                                    <th className="px-4 py-2 border-b text-left text-white font-semibold">
                                        Website
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
                                            breeders?.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="text-center py-4 bg-red-100 p-5 rounded-md"
                                                    >
                                                        No breeders found.
                                                    </td>
                                                </tr>
                                            )}
                                        {breeders?.map((breeder) => (
                                            <tr
                                                key={breeder.id}
                                                className="hover:bg-gray-50 cursor-pointer"
                                                onClick={() =>
                                                    navigate(
                                                        `/admin/breeders/${breeder.id}`
                                                    )
                                                }
                                            >
                                                <td className="px-4 py-5 text-primary font-medium border-b">
                                                    {breeder.username}
                                                </td>
                                                <td className="px-4 py-2 text-[#353535] border-b">
                                                    {breeder.contact_person}
                                                </td>
                                                <td className="px-4 py-2 text-[#353535] border-b">
                                                    {breeder.company_email}
                                                </td>
                                                <td className="px-4 py-2 text-[#353535] border-b">
                                                    {breeder.company_name}
                                                </td>
                                                <td className="px-4 py-2 text-[#353535] border-b">
                                                    {breeder.phone}
                                                </td>
                                                <td className="px-4 py-2 text-[#353535] border-b">
                                                    <a
                                                        href={breeder.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {breeder.website}
                                                    </a>
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
                {breeders?.length > 0 && (
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

                <ImportBreederModal
                    isOpen={isImportModalOpen}
                    onClose={() => setIsImportModalOpen(false)}
                    onImport={handleImport}
                />
            </div>
        </main>
    );
}
