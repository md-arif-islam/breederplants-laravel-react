import React, { useContext, useEffect } from "react";
import { Leaf } from "lucide-react";
import VarietyReportCard from "../components/VarietyReportCard";
import PlantImg from "../assets/images/big.png";
import { useVarietyReportStore } from "../store/useVarietyReportStore";
import { useStore } from "../store/useStore";

// Skeleton component for variety report card
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

const VarietyReportsPage = () => {
    const {
        isLoading,
        varietyReports,
        getVarietyReportsByUser,
        currentPage,
        totalPages,
    } = useVarietyReportStore();
    const { authUser } = useStore();

    useEffect(() => {
        // Pass the currentPage explicitly, default to 1 if not set.
        getVarietyReportsByUser(authUser.id, currentPage);
    }, [authUser.id, getVarietyReportsByUser, currentPage]);

    useEffect(() => {
        document.title = "Variety Reports - Breederplants";
    });

    const handlePageChange = (page) => {
        getVarietyReportsByUser(authUser.id, page);
    };

    return (
        <div className="bg-gray-50 -mt-12 ">
            {/* Content */}
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="min-h-screen bg-white rounded-t-3xl p-4 lg:p-6">
                        <h2 className="text-xl md:text-2xl font-bold mb-6">
                            Varieties on trial
                        </h2>
                        <div className="grid lg:grid-cols-2 gap-1 lg:gap-4">
                            {isLoading
                                ? Array.from({ length: 2 }).map((_, idx) => (
                                      <VarietyReportCardSkeleton key={idx} />
                                  ))
                                : varietyReports?.map((report) => (
                                      <VarietyReportCard
                                          key={report.id}
                                          report={report}
                                      />
                                  ))}
                        </div>
                        {varietyReports?.length > 0 && (
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

export default VarietyReportsPage;
