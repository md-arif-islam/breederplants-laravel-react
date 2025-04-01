import { useEffect, useState } from "react";
import { useStore } from "../../store/useStore";
import { useNavigate } from "react-router-dom";
import { useProductionReportStore } from "../../store/useProductionReportStore";
import { format } from "date-fns";
import { formatDate } from "../../utils/formatDate"; // Import formatDate

const quarterOptions = [
    { value: "q1", label: "Q1" },
    { value: "q2", label: "Q2" },
    { value: "q3", label: "Q3" },
    { value: "q4", label: "Q4" },
];

const statusOptions = [
    { value: "submitted", label: "Submitted" },
    { value: "pending", label: "Pending" },
];

export default function AdminProductionReportsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGrower, setSelectedGrower] = useState("");
    const [selectedQuarter, setSelectedQuarter] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");
    const {
        getAllProductionReportsForAdmin,
        isLoading,
        productionReports,
        currentPage,
        totalPages,
    } = useProductionReportStore();
    const { growers, getAllGrowers } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Admin Production Reports - Breederplants";
    }, []);

    useEffect(() => {
        getAllGrowers();
    }, [getAllGrowers]);

    useEffect(() => {
        getAllProductionReportsForAdmin(
            currentPage,
            searchQuery,
            selectedGrower,
            selectedQuarter,
            selectedStatus
        );
    }, [
        getAllProductionReportsForAdmin,
        currentPage,
        searchQuery,
        selectedGrower,
        selectedQuarter,
        selectedStatus,
    ]);

    const handlePageChange = (page) => {
        getAllProductionReportsForAdmin(
            page,
            searchQuery,
            selectedGrower,
            selectedQuarter,
            selectedStatus
        );
    };

    const getQuarterDateRange = (year, quarter) => {
        switch (quarter) {
            case "q1":
                return {
                    start: new Date(year, 0, 1),
                    end: new Date(year, 2, 31),
                };
            case "q2":
                return {
                    start: new Date(year, 3, 1),
                    end: new Date(year, 5, 30),
                };
            case "q3":
                return {
                    start: new Date(year, 6, 1),
                    end: new Date(year, 8, 30),
                };
            case "q4":
                return {
                    start: new Date(year, 9, 1),
                    end: new Date(year, 11, 31),
                };
            default:
                return null;
        }
    };

    const formatDateWrapper = (dateString) => {
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
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Search input */}
                    <div className="flex flex-wrap gap-2">
                        <select
                            value={selectedGrower}
                            onChange={(e) => setSelectedGrower(e.target.value)}
                            className="w-full md:w-[180px] px-3 py-2 rounded-md shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                        >
                            <option value="">Select Grower</option>
                            {growers?.map((grower) => (
                                <option key={grower.id} value={grower.id}>
                                    {grower.company_name}
                                </option>
                            ))}
                        </select>

                        {/* Select Quarter */}
                        <select
                            value={selectedQuarter}
                            onChange={(e) => setSelectedQuarter(e.target.value)}
                            className="w-full md:w-[180px] px-3 py-2 rounded-md shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                        >
                            <option value="">Select Quarter</option>
                            {quarterOptions.map((quarter) => (
                                <option
                                    key={quarter.value}
                                    value={quarter.value}
                                >
                                    {quarter.label}
                                </option>
                            ))}
                        </select>

                        {/* Select Status */}
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full md:w-[180px] px-3 py-2 rounded-md shadow-sm border border-gray-300 bg-white focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out"
                        >
                            <option value="">Select Status</option>
                            {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* TABLE */}
                <div className="rounded-md border bg-white">
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto shadow rounded overflow-hidden">
                            <thead>
                                <tr className="bg-green-600 h-16 rounded-md shadow">
                                    <th className="px-4 py-5 border-b text-left text-white font-semibold">
                                        Grower Name
                                    </th>
                                    <th className="px-4 py-4 border-b text-left text-white font-semibold">
                                        Quarter
                                    </th>
                                    <th className="px-4 py-4 border-b text-left text-white font-semibold">
                                        About Quarter(s)
                                    </th>
                                    <th className="px-4 py-4 border-b text-left text-white font-semibold">
                                        Date Opened
                                    </th>
                                    <th className="px-4 py-4 border-b text-left text-white font-semibold">
                                        Date Submitted
                                    </th>
                                    <th className="px-4 py-4 border-b text-left text-white font-semibold">
                                        Status
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
                                            productionReports?.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={7}
                                                        className="text-center py-4 bg-red-100 p-5 rounded-md"
                                                    >
                                                        No production reports
                                                        found.
                                                    </td>
                                                </tr>
                                            )}
                                        {!isLoading &&
                                            productionReports?.length > 0 &&
                                            productionReports.map((report) => {
                                                const dateRange =
                                                    getQuarterDateRange(
                                                        report.year,
                                                        report.quarter
                                                    );
                                                const dateOpen = dateRange
                                                    ? dateRange.start
                                                    : null;
                                                return (
                                                    <tr
                                                        key={report.id}
                                                        className="hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                                                        onClick={() => {
                                                            if (
                                                                report.submission_date
                                                            ) {
                                                                navigate(
                                                                    `/admin/production-reports/${report.id}`
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <td className="px-4 py-4 border-b text-left">
                                                            {
                                                                report.grower
                                                                    .company_name
                                                            }
                                                        </td>
                                                        <td className="px-4 py-4 border-b text-left">
                                                            {report.quarter.toUpperCase()}{" "}
                                                            - {report.year}
                                                        </td>
                                                        <td className="px-4 py-4 border-b text-left">
                                                            {report.quarters_array
                                                                ? JSON.parse(
                                                                      report.quarters_array
                                                                  )
                                                                      .reverse()
                                                                      .map(
                                                                          (q) =>
                                                                              `${q.quarter.toUpperCase()} - ${
                                                                                  q.year
                                                                              }`
                                                                      )
                                                                      .join(
                                                                          ", "
                                                                      )
                                                                : "N/A"}
                                                        </td>
                                                        <td className="px-4 py-4 border-b text-left">
                                                            {dateOpen
                                                                ? formatDateWrapper(
                                                                      dateOpen
                                                                  )
                                                                : "N/A"}
                                                        </td>
                                                        <td className="px-4 py-4 border-b text-left">
                                                            {formatDateWrapper(
                                                                report.submission_date
                                                            ) || "N/A"}
                                                        </td>
                                                        <td className="px-4 py-4 border-b text-left">
                                                            {report.submission_date ? (
                                                                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">
                                                                    Submitted
                                                                </span>
                                                            ) : (
                                                                <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-sm">
                                                                    Pending
                                                                </span>
                                                            )}
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
                {productionReports?.length > 0 && (
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
