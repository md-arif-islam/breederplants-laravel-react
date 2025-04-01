import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Download, DownloadIcon, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSalesReportStore } from "../../store/useSalesReportStore";
import { format } from "date-fns";

export default function AdminSalesReportViewPage() {
    const {
        getSalesReportById,
        currentSalesReport,
        isLoading,
        exportSalesReport,
        deleteSalesReport,
    } = useSalesReportStore();
    const [showPopup, setShowPopup] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Sales Report Details - Breederplants";
    }, []);

    useEffect(() => {
        getSalesReportById(id);
    }, [getSalesReportById, id]);

    const handleDelete = async (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        setShowPopup(false);
        const response = await deleteSalesReport(id);
        if (response && response.status === 200) {
            navigate("/admin/sales-reports");
        }
    };

    const cancelDelete = () => {
        setShowPopup(false);
    };

    const handleEmpty = async () => {
        // Logic to empty the sales report
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            await exportSalesReport(id);
        } finally {
            setIsExporting(false);
        }
    };

    if (isLoading || !currentSalesReport) {
        return (
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 mx-auto"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                </div>
            </main>
        );
    }

    const reportData = currentSalesReport.data
        ? JSON.parse(currentSalesReport.data)
        : [];

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h2 className="content-title text-xl font-semibold mb-4">
                            Sales Report Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <p className="form-label block text-sm font-medium text-gray-700">
                                    Grower
                                </p>
                                <p className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                                    {currentSalesReport?.grower?.company_name}
                                </p>
                            </div>

                            <div>
                                <p className="form-label block text-sm font-medium text-gray-700">
                                    Submission Date
                                </p>
                                <p className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                                    {currentSalesReport.submission_date
                                        ? format(
                                              new Date(
                                                  currentSalesReport.submission_date
                                              ),
                                              "yyyy-MM-dd HH:mm:ss"
                                          )
                                        : "Not Submitted"}
                                </p>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table-auto w-full border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-2 border-b font-medium text-gray-900">
                                            Product Name
                                        </th>
                                        <th className="px-4 py-2 border-b font-medium text-gray-900">
                                            Unit Price
                                        </th>
                                        <th className="px-4 py-2 border-b font-medium text-gray-900">
                                            Amount
                                        </th>
                                        <th className="px-4 py-2 border-b font-medium text-gray-900">
                                            Total Price
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportData.map((data, index) => (
                                        <tr key={index}>
                                            <td className="px-4 py-2 border-b text-gray-700">
                                                {data.product_name}
                                            </td>
                                            <td className="px-4 py-2 border-b text-gray-700">
                                                {Number(
                                                    data.unit_price
                                                ).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 border-b text-gray-700">
                                                {data.amount}
                                            </td>
                                            <td className="px-4 py-2 border-b text-gray-700">
                                                {(
                                                    data.unit_price *
                                                    data.amount
                                                ).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="flex gap-2 pt-8">
                            <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                onClick={handleExport}
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                        Sending
                                    </>
                                ) : (
                                    <>
                                        <DownloadIcon className="mr-2 h-4 w-4" />
                                        Download
                                    </>
                                )}
                            </button>
                            {/* HIDE: Delete Button */}
                            {/* <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                onClick={handleDelete}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </button> */}
                        </div>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                    <div className="bg-white p-4 rounded-md shadow-md">
                        <p>
                            Are you sure you want to delete this sales report?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-2 mt-4">
                            <button
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                onClick={confirmDelete}
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
        </main>
    );
}
