import { Leaf, PenBox, Plus, PlusCircle } from "lucide-react";
import VarietySampleCard from "../components/VarietySampleCard";
import PlantImg from "../assets/images/big.png";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useVarietyReportStore } from "../store/useVarietyReportStore";
import { PageTitleContext } from "../context/PageTitleContext";

export default function VarietyReportShow() {
    const {
        isLoading,
        getUserVarietyReportById,
        varietyReport: report,
    } = useVarietyReportStore();

    const [imgLoaded, setImgLoaded] = useState(false);

    // Fetch id from URL
    const { id } = useParams();
    const navigate = useNavigate();
    const { setTitle } = useContext(PageTitleContext);

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
                                <img
                                    src={thumbnailUrl}
                                    alt={report?.variety_name}
                                    loading="lazy"
                                    onLoad={() => setImgLoaded(true)}
                                    className={`w-full h-56 md:h-[60vh] object-cover rounded-t-3xl md:rounded-2xl transition-opacity duration-300 ${
                                        imgLoaded ? "opacity-100" : "opacity-0"
                                    }`}
                                />
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
                                        {report?.date_of_propagation}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Date of Potting
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report?.date_of_potting}
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
                                            JSON.parse(
                                                report.samples_schedule
                                            )[0]}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Start Date
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report?.start_date}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        End Date
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {report?.end_date || "N/A"}
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

                            {report?.samples?.map((sample) => (
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
