import { useEffect } from "react";
import { useSalesReportStore } from "../store/useSalesReportStore";
import { Link } from "react-router-dom";

export default function SalesReportsPage() {
  const {
    salesReports,
    getAllSalesReports,
    currentPage,
    totalPages,
    isLoading,
  } = useSalesReportStore();

  useEffect(() => {
    getAllSalesReports();
  }, [getAllSalesReports]);

  useEffect(() => {
    // page title
    document.title = "Sales Reports - Breederplants";
  });

  const handlePageChange = (newPage) => {
    getAllSalesReports(newPage);
  };

  return (
    <div className="bg-gray-50 -mt-12">
      {/* Content */}
      <div className="container mx-auto">
        <div className="-mt-12 z-10 relative">
          <div className="min-h-screen bg-white rounded-t-3xl p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6">
              Sales Report
            </h2>
            <p className="pb-6 text-sm sm:text-sm md:text-base">
              Below are the sales reports for your account. You can submit a
              sales report for the current quarter if you haven&apos;t already
              done so.
            </p>

            {isLoading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <>
                {salesReports?.length === 0 && (
                  <div className="text-center space-y-5 bg-red-200 p-4 rounded">
                    No sales reports found.
                  </div>
                )}
                {salesReports?.map((report) => (
                  <div key={report.id} className="mx-auto py-2 sm:py-3 md:py-4">
                    <div className="bg-primary text-white p-2 sm:p-3 md:p-4 rounded-t-lg">
                      <h1 className="text-base sm:text-lg md:text-xl font-medium">
                        {String(report.quarter).toUpperCase()} - {report.year}
                      </h1>
                    </div>

                    <div className="border rounded-b-lg p-2 sm:p-4 md:p-6 space-y-2 md:space-y-4">
                      <div className="space-y-1 sm:space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2">
                          <h2 className="text-gray-600 font-medium text-sm sm:text-sm">
                            <strong>About Quarter(s):</strong>{" "}
                            {report?.quarters_array &&
                              JSON.parse(report?.quarters_array).map(
                                (q, index, array) => (
                                  <span key={index}>
                                    {q.quarter.charAt(0).toUpperCase() +
                                      q.quarter.slice(1)}{" "}
                                    - {q.year}
                                    {index !== array.length - 1 ? ", " : ""}
                                  </span>
                                )
                              )}
                          </h2>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2">
                          <h2 className="text-gray-600 font-medium text-sm sm:text-sm">
                            <strong>Date Opened:</strong>{" "}
                            {(() => {
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

                              const dateOpen = getQuarterDateRange(
                                report.year,
                                report.quarter
                              )?.start;

                              return dateOpen
                                ? new Intl.DateTimeFormat("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  }).format(dateOpen)
                                : "N/A";
                            })()}
                          </h2>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2">
                          <h2 className="text-gray-600 font-medium text-sm sm:text-sm">
                            <strong>Status:</strong>{" "}
                            {report.submission_date ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                Submitted
                              </span>
                            ) : report.year < new Date().getFullYear() ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                Passed
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
                                Waiting
                              </span>
                            )}
                          </h2>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2">
                          <h2 className="text-gray-600 font-medium text-sm sm:text-sm">
                            <strong>Submission Date:</strong>{" "}
                            {report.submission_date ? (
                              <>
                                {new Intl.DateTimeFormat("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }).format(new Date(report.submission_date))}
                              </>
                            ) : (
                              <Link
                                to={`/sales-reports/create/${report.year}/${report.quarter}`}
                                className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm sm:text-sm font-medium text-white bg-primary hover:bg-secondary transition-colors">
                                Submit Now
                              </Link>
                            )}
                          </h2>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {salesReports?.length > 0 && (
              <div className="flex justify-center mt-4 sm:mt-6">
                <nav className="inline-flex rounded-md shadow-sm gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 text-sm sm:text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-l-md hover:bg-gray-50 ${
                      currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
                    }`}>
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 text-sm sm:text-sm font-medium border border-gray-300 ${
                          currentPage === page
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50"
                        }`}>
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 text-sm sm:text-sm font-medium bg-white text-gray-700 border border-gray-300 rounded-r-md hover:bg-gray-50 ${
                      currentPage === totalPages
                        ? "cursor-not-allowed opacity-50"
                        : ""
                    }`}>
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
}
