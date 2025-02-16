import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import { useNavigate } from "react-router-dom";
import { ImportGrowerModal } from "../../components/backend/ImportGrowerModal";

export default function AdminGrowerPage() {
  // Track local input state
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const {
    getAllGrowers,
    isLoading,
    growers,
    currentPage,
    totalPages,
    exportCSVGrowers,
    importCSVGrowers,
  } = useStore();

  const navigate = useNavigate();

  // Fetch all growers on mount (or whenever currentPage changes).
  useEffect(() => {
    // By default, pass the current searchQuery
    getAllGrowers(currentPage, searchQuery);
  }, [getAllGrowers, currentPage, searchQuery]);

  const handlePageChange = (page) => {
    getAllGrowers(page, searchQuery);
  };

  const handleImport = async (file) => {
    try {
      await importCSVGrowers(file);
      setIsImportModalOpen(false);
      // Refresh growers list
      getAllGrowers(currentPage, searchQuery);
    } catch (error) {
      // Handle error (e.g., display error message)
      console.error("Import failed:", error);
      // Optionally, display a user-friendly error message using toast
    }
  };

  const handleExportCSV = async () => {
    await exportCSVGrowers();
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
              onClick={() => navigate("/admin/growers/create")}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Add Grower
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Export CSV
            </button>
            <button
              className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              onClick={() => setIsImportModalOpen(true)}>
              Import CSV
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
                  <th className="px-4 py-2 border-b text-left text-white font-semibold">
                    Sales Reporting Month
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      Loading...
                    </td>
                  </tr>
                )}
                {!isLoading && growers?.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      No growers found.
                    </td>
                  </tr>
                )}
                {growers?.map((grower) => (
                  <tr
                    key={grower.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/growers/${grower.id}`)}>
                    <td className="px-4 py-5 text-primary font-medium border-b">
                      {grower.username}
                    </td>
                    <td className="px-4 py-2 text-[#353535] border-b">
                      {grower.contact_person}
                    </td>
                    <td className="px-4 py-2 text-[#353535] border-b">
                      {grower.company_email}
                    </td>
                    <td className="px-4 py-2 text-[#353535] border-b">
                      {grower.company_name}
                    </td>
                    <td className="px-4 py-2 text-[#353535] border-b">
                      {grower.phone}
                    </td>
                    <td className="px-4 py-2 text-[#353535] border-b">
                      <a
                        href={grower.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline">
                        {grower.website}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-[#353535] border-b">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {JSON.parse(grower.sales_reporting_quarter).map(
                            (quarter, index) => (
                              <span
                                key={index}
                                className="text-sm bg-primary text-white px-2 py-1 rounded-md font-bold text-[12px] mr-1">
                                {quarter.toUpperCase()}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Controls */}
        {growers?.length > 0 && (
          <div className="flex justify-center mt-6">
            <nav className="inline-flex rounded-md shadow-sm gap-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-l-md hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}>
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-4 py-2 text-sm font-medium ${
                      currentPage === page
                        ? "bg-green-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    } border border-gray-300`}>
                    {page}
                  </button>
                )
              )}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-r-md hover:bg-gray-50 ${
                  currentPage === totalPages
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}>
                Next
              </button>
            </nav>
          </div>
        )}

        <ImportGrowerModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImport}
        />
      </div>
    </main>
  );
}
