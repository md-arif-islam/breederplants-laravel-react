import { File, TreePalm, Users } from "lucide-react";
import React, { useContext, useEffect } from "react";
import { PageTitleContext } from "../../context/PageTitleContext";
import { useDashboardStore } from "../../store/useDashboardStore";

const AdminDashboardPage = () => {
    const { isLoading, dashboardStats, getDashboardStats } =
        useDashboardStore();
    const { setTitle } = useContext(PageTitleContext);

    useEffect(() => {
        getDashboardStats();
    }, [getDashboardStats]);

    useEffect(() => {
        document.title = "Dashboard - Breederplants";
        setTitle("Dashboard");
    }, [setTitle]);

    const stats = dashboardStats || {};

    return (
        // TODO: Add perfect icons
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="px-6 py-8 mx-auto">
                <div className="mt-4">
                    {isLoading ? (
                        <div className="flex flex-wrap -mx-6">
                            {[...Array(8)].map((_, index) => (
                                <div
                                    key={index}
                                    className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4"
                                >
                                    <div className="flex items-center px-5 py-6 bg-white rounded-md shadow animate-pulse">
                                        <div className="p-3 bg-gray-300 rounded-full w-10 h-10" />
                                        <div className="mx-5 flex flex-col space-y-2">
                                            <div className="h-6 bg-gray-300 rounded w-16" />
                                            <div className="h-4 bg-gray-300 rounded w-20" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap -mx-6">
                            {/* Growers */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.totalGrowers || 0}
                                        </h4>
                                        <div className="text-gray-500">
                                            Growers
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Breeders */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <Users className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.totalBreeders || 0}
                                        </h4>
                                        <div className="text-gray-500">
                                            Breeders
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Variety Reports */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <File className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.totalVarietyReports || 0}
                                        </h4>
                                        <div className="text-gray-500">
                                            Variety Reports
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Variety Samples */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <File className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.totalVarietySamples || 0}
                                        </h4>
                                        <div className="text-gray-500">
                                            Variety Samples
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <TreePalm className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.totalProducts || 0}
                                        </h4>
                                        <div className="text-gray-500">
                                            Products
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Quarter */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <File className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700 uppercase">
                                            {stats.currentQuarter || "-"}
                                        </h4>
                                        <div className="text-gray-500">
                                            Current Quarter
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Year */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <File className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.currentYear || "-"}
                                        </h4>
                                        <div className="text-gray-500">
                                            Current Year
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Not Submitted Sales Reports */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <File className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.notSubmittedSalesReportCountAtCurrentQuarter ||
                                                0}
                                        </h4>
                                        <div className="text-gray-500">
                                            Pending Sales Reports
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submitted Sales Reports */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <File className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.submittedSalesReportCountAtCurrentQuarter ||
                                                0}
                                        </h4>
                                        <div className="text-gray-500">
                                            Submitted Sales Reports
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* News */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <File className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.totalNews || 0}
                                        </h4>
                                        <div className="text-gray-500">
                                            News
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Not Submitted Production Reports */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <File className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.notSubmittedProductionReportCountAtCurrentQuarter ||
                                                0}
                                        </h4>
                                        <div className="text-gray-500">
                                            Pending Production Reports
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submitted Production Reports */}
                            <div className="w-full px-6 sm:w-1/2 lg:w-1/3 xl:w-1/4 mb-4">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow">
                                    <div className="p-3 bg-primary bg-opacity-75 rounded-full">
                                        <File className="w-8 h-8 text-white" />
                                    </div>
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">
                                            {stats.submittedProductionReportCountAtCurrentQuarter ||
                                                0}
                                        </h4>
                                        <div className="text-gray-500">
                                            Submitted Production Reports
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};

export default AdminDashboardPage;
