import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Download, Leaf, Bell, Loader2 } from "lucide-react";
import { VarietySampleCard } from "../../components/backend/VarietySampleCard";
import hydrangeaImg from "../../assets/images/hydrangea-paniculata.jpg";
import { useVarietyReportStore } from "../../store/useVarietyReportStore";
import { useNavigate, useParams } from "react-router-dom";
import { Gallery, Item } from "react-photoswipe-gallery";
import { formatDate } from "../../utils/formatDate.js";

export default function AdminVarietyReportViewPage() {
    const {
        isLoading,
        getVarietyReportById,
        varietyReport: report,
        deleteVarietyReport,
        exportVarietyReport,
        reminderVarietyReport,
    } = useVarietyReportStore();

    const [showPopup, setShowPopup] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Fetch id from URL
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Variety Report View - Breederplants";
    }, []);

    useEffect(() => {
        getVarietyReportById(id);
    }, [getVarietyReportById, id]);

    const handleDelete = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        setShowPopup(false);
        const response = await deleteVarietyReport(id);
        if (response.status === 200) {
            navigate(`/admin/variety-reports`);
        }
    };

    const cancelDelete = () => {
        setShowPopup(false);
    };

    const handleExport = async () => {
        await exportVarietyReport(id);
    };

    const handleReminder = async () => {
        await reminderVarietyReport(id);
    };

    const thumbnailUrl = report?.thumbnail
        ? `${import.meta.env.VITE_API_URL}/${report.thumbnail}`
        : null;

    // Dynamically measure the image's natural width and height
    useEffect(() => {
        if (!thumbnailUrl || thumbnailUrl === "/placeholder.svg") return;

        const img = new Image();
        img.src = thumbnailUrl;
        img.onload = () => {
            setDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight,
            });
        };
    }, [thumbnailUrl]);

    const getFormattedDate = (dateString) => {
        try {
            return formatDate(dateString);
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
        }
    };

    return (
        // TODO: Next Sample Date show today's date
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                <div className="block space-y-4 md:space-y-0 md:grid gap-8 md:grid-cols-[300px,1fr]">
                    {/* Left Column - Image with lazy load and placeholder */}
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                        {/* Show placeholder if image is not loaded */}
                        {!imgLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                <Leaf className="w-8 h-8 text-gray-400 animate-pulse" />
                            </div>
                        )}
                        <Gallery withDownloadButton>
                            <Item
                                original={thumbnailUrl}
                                thumbnail={thumbnailUrl}
                                width={dimensions.width}
                                height={dimensions.height}
                                alt={report?.variety_name}
                            >
                                {({ ref, open }) => (
                                    <img
                                        ref={ref}
                                        onClick={open}
                                        src={thumbnailUrl}
                                        alt={report?.variety_name}
                                        loading="lazy"
                                        onLoad={() => setImgLoaded(true)}
                                        className={`cursor-pointer w-full h-auto object-cover rounded-lg mt-3 transition-opacity duration-300 ${
                                            imgLoaded
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                )}
                            </Item>
                        </Gallery>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Variety Name
                                    </h3>
                                    <p className="mt-1">
                                        {report?.variety_name}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Next Sample Date
                                    </h3>
                                    <p className="mt-1">
                                        {report?.samples_schedule &&
                                            getFormattedDate(
                                                JSON.parse(
                                                    report.samples_schedule
                                                )[0]
                                            )}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Company
                                    </h3>
                                    <p className="mt-1">
                                        {report?.grower?.company_name}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Breeder Name
                                    </h3>
                                    <p className="mt-1">
                                        {report?.breeder?.company_name}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Date of Propagation
                                    </h3>
                                    <p className="mt-1">
                                        {report?.date_of_propagation}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Date of Potting
                                    </h3>
                                    <p className="mt-1">
                                        {report?.date_of_potting}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Amount of Plants
                                    </h3>
                                    <p className="mt-1">
                                        {report?.amount_of_plants}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Amount of Samples
                                    </h3>
                                    <p className="mt-1">22</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        Start Date
                                    </h3>
                                    <p className="mt-1">
                                        {report?.start_date &&
                                            getFormattedDate(
                                                report?.start_date
                                            )}
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">
                                        End Date
                                    </h3>
                                    <p className="mt-1">
                                        {report?.end_date &&
                                            getFormattedDate(report?.end_date)}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:flex gap-2 pt-4">
                                <button
                                    onClick={() =>
                                        navigate(
                                            `/admin/variety-reports/${id}/edit`
                                        )
                                    }
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50 justify-center "
                                >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50 justify-center"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </button>
                                <button
                                    onClick={handleExport}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50 justify-center"
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    Export
                                </button>

                                <button
                                    onClick={handleReminder}
                                    disabled={isLoading}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50 justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            Sending
                                        </>
                                    ) : (
                                        <>
                                            <Bell className="mr-2 h-4 w-4" />
                                            Reminder
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Variety Samples
                        </h2>
                        <button
                            onClick={() =>
                                navigate(
                                    `/admin/variety-reports/${id}/variety-sample/create`
                                )
                            }
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Create new
                        </button>
                    </div>

                    {report?.samples?.length === 0 && (
                        <div className="text-center space-y-5 bg-red-100 p-5 rounded-md">
                            No variety sample found.
                        </div>
                    )}

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {report?.samples?.map((sample) => (
                            <VarietySampleCard
                                key={sample.id}
                                sample={sample}
                                varietyReportId={id}
                            />
                        ))}
                    </div>
                </div>

                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <p>
                                Are you sure you want to delete this variety
                                report?
                            </p>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={confirmDelete}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50 justify-center"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={cancelDelete}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50 justify-center"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
