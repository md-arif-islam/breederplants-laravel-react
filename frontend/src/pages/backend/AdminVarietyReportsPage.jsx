import React, { useState, useEffect } from "react";
import { useVarietyReportStore } from "../../store/useVarietyReportStore";
import { useNavigate } from "react-router-dom";
import { ImportReportModal } from "../../components/backend/ImportReportModal";
import { VarietyReportCard } from "../../components/backend/VarietyReportCard";

export default function VarietyReportPage() {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState("");
  const [growerId, setGrowerId] = useState("");

  const {
    isLoading,
    getAllVarietyReports,
    varietyReports,
    currentPage,
    totalPages,
    growers,
    importVarietyReport, // Get the importVarietyReport function from the store
  } = useVarietyReportStore();

  const navigate = useNavigate();

  useEffect(() => {
    getAllVarietyReports(currentPage, searchQuery, sort, growerId);
  }, [currentPage, searchQuery, sort, growerId, getAllVarietyReports]);

  const handlePageChange = (page) => {
    getAllVarietyReports(page, searchQuery, sort, growerId);
  };

  const handleImport = async (formData) => {
    // Call the importVarietyReport function from the store
    try {
      await importVarietyReport(formData);
      // After successful import, refresh the variety reports
      getAllVarietyReports(currentPage, searchQuery, sort, growerId);
    } catch (error) {
      // Handle the error if the import fails
      console.error("Failed to import variety report", error);
    } finally {
      setIsImportModalOpen(false); // Close the modal after import
    }
  };

  const handleDelete = () => {
    getAllVarietyReports(currentPage, searchQuery, sort, growerId);
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
              value={sort}>
              <option value="">Select sort</option>
              <option value="a-z">Grower name (A-Z)</option>
              <option value="last-item-first">Last item first</option>
              <option value="first-item-last">First item last</option>
            </select>
            <select
              onChange={(e) => setGrowerId(e.target.value)}
              className="w-full md:w-[180px] px-3 py-2 rounded-md shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out">
              <option value="">Select grower</option>
              {growers?.map((grower) => (
                <option key={grower.id} value={grower.id}>
                  {grower.company_name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/admin/variety-reports/create")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Create Report
            </button>
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100">
              Import Report(s)
            </button>
          </div>
        </div>

        {isLoading && <div className="text-center space-y-5">Loading...</div>}
        {!isLoading && varietyReports?.length === 0 && (
          <div className="text-center space-y-5">No variety reports found.</div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {varietyReports?.map((report) => (
            <VarietyReportCard
              key={report.id}
              report={report}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {varietyReports?.length > 0 && (
          <div className="flex justify-center mt-6">
            <nav className="inline-flex rounded-md shadow-sm gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-l-md hover:bg-gray-50 ${
                  currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                }`}>
                Previous
              </button>
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

        <ImportReportModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImport={handleImport}
        />
      </div>
    </main>
  );
}
