import { Leaf, PenBox, Plus, PlusCircle } from "lucide-react";
import VarietySampleCard from "../components/VarietySampleCard";
import PlantImg from "../assets/images/big.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useVarietyReportStore } from "../store/useVarietyReportStore";
import { PageTitleContext } from "../context/PageTitleContext";
import { Gallery, Item } from "react-photoswipe-gallery";
import { formatDate } from "../utils/formatDate.js";

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

export default function VarietyReportShow() {
    const {
        isLoading,
        getUserVarietyReportById,
        varietyReport: report,
    } = useVarietyReportStore();

    const [imgLoaded, setImgLoaded] = useState(false);

    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Fetch id from URL
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle } = useContext(PageTitleContext);

    const getFormattedDate = (dateString) => {
        try {
            return formatDate(dateString);
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
        }
    };

    useEffect(() => {
        getUserVarietyReportById(id);
    }, [getUserVarietyReportById, id]);

    useEffect(() => {
        if (report?.variety_name) {
            document.title = report.variety_name + " - Breederplants";
        }
    }, [report]);

    useEffect(() => {
        if (report?.variety_name && !isLoading) {
            setTitle(report?.variety_name + " Details");
        }
    }, [setTitle, report]);

    // Build dynamic thumbnail URL
    const thumbnailUrl =
        report?.thumbnail && !report.thumbnail.startsWith("data:")
            ? `${import.meta.env.VITE_API_URL}/${report.thumbnail}`
            : report?.thumbnail || "/placeholder.svg";

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

    return (
        <div className="bg-gray-50 -mt-12">
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="bg-white rounded-3xl p-0 md:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-10">
                            <div className="relative text-center flex items-center md:items-start justify-center w-full rounded-t-3xl">
                                {!imgLoaded && (
                                    <div className="absolute inset-0 flex rounded-t-3xl items-center justify-center bg-gray-200">
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
                                                onLoad={() =>
                                                    setImgLoaded(true)
                                                }
                                                className={`w-full h-56 md:h-[60vh] object-cover rounded-t-3xl md:rounded-2xl transition-opacity duration-300 ${
                                                    imgLoaded
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                            />
                                        )}
                                    </Item>
                                </Gallery>

                                {/* <img
                                    src={thumbnailUrl}
                                    alt={report?.variety_name}
                                    loading="lazy"
                                    onLoad={() => setImgLoaded(true)}
                                    className={`w-full h-56 md:h-[60vh] object-cover rounded-t-3xl md:rounded-2xl transition-opacity duration-300 ${
                                        imgLoaded ? "opacity-100" : "opacity-0"
                                    }`}
                                /> */}
                            </div>

                            <div className="bg-white rounded-t-3xl p-4 md:p-0 z-30 relative -mt-12 md:mt-0">
                                <h2 className="text-xl md:text-2xl font-bold mb-2 lg:mb-6">
                                    {report?.variety_name}
                                </h2>
                                <div className="grid grid-cols-2 gap-y-2 p-2">
                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Company
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report?.grower?.company_name}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Breeder
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report?.breeder?.company_name}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Date of Propagation
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {getFormattedDate(
                                            report?.date_of_propagation
                                        )}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Date of Potting
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {getFormattedDate(
                                            report?.date_of_potting
                                        )}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Amount of Plants
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report?.amount_of_plants}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Amount of Samples
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report?.samples?.length ?? "N/A"}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Next Sample Date
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report &&
                                            getFormattedDate(
                                                JSON.parse(
                                                    report.samples_schedule
                                                )[0]
                                            )}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Start Date
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {getFormattedDate(report?.start_date)}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        End Date
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {getFormattedDate(report?.end_date) ||
                                            "N/A"}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Pot Size
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report?.pot_size ?? "N/A"}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Pot Trial
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report?.pot_trial ? "Yes" : "No"}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Open Field Trial
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report?.open_field_trial
                                            ? "Yes"
                                            : "No"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-1 lg:gap-4 mt-5 border-t pt-5">
                            {report?.samples?.length === 0 && (
                                <div className="text-center bg-red-100 p-4 rounded space-y-5">
                                    No variety samples found.
                                </div>
                            )}

                            {isLoading
                                ? Array.from({ length: 2 }).map((_, idx) => (
                                      <VarietyReportCardSkeleton key={idx} />
                                  ))
                                : report?.samples?.map((sample) => (
                                      <VarietySampleCard
                                          key={sample.id}
                                          sample={sample}
                                          varietyReportId={id}
                                      />
                                  ))}
                        </div>
                        <div className="border rounded-full p-2 mt-2 lg:mt-6">
                            <Link
                                to={`/variety-reports/${id}/variety-sample/create`}
                                className="w-full text-center align-middle h-12 rounded-full text-sm lg:text-lg bg-primary hover:bg-secondary text-white font-semibold transition-colors flex items-center justify-center"
                            >
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add new Sample
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
