import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function VarietyReportCard({ report }) {
    const [imgLoaded, setImgLoaded] = useState(false); // state to track image load

    const thumbnailUrl =
        report.thumbnail && !report.thumbnail.startsWith("data:")
            ? `${import.meta.env.VITE_API_URL}/${report.thumbnail}`
            : report.thumbnail || "/placeholder.svg";

    return (
        <Link
            to={`/variety-reports/${report.id}`}
            className="bg-white rounded-2xl p-2 flex items-center gap-4 mb-4 drop-shadow-md hover:shadow-xl"
        >
            <div className="w-20 h-20 lg:w-28 lg:h-28 flex-shrink-0 relative">
                {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-xl">
                        <Leaf className="w-8 h-8 text-gray-500 animate-pulse" />
                    </div>
                )}
                <img
                    src={thumbnailUrl}
                    alt={report.variety_name}
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
                        imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-md md:text-xl font-semibold text-gray-900 mb-1">
                    {report.variety_name}
                </h3>
                {report.start_date && (
                    <p className="text-gray-600 text-xs md:text-sm">
                        Start Date: {report.start_date}
                    </p>
                )}
                {report.end_date && (
                    <p className="text-gray-600 text-xs md:text-sm">
                        End Date: {report.end_date}
                    </p>
                )}
                {report.samples_schedule && (
                    <p className="text-gray-600 text-xs md:text-sm">
                        Next Sample Date:{" "}
                        {JSON.parse(report.samples_schedule)[0]}
                    </p>
                )}
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
        </Link>
    );
}
