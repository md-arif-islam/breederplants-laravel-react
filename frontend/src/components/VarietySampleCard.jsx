import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function VarietySampleCard({ sample, varietyReportId }) {
    const [imgLoaded, setImgLoaded] = useState(false); // state to track image load

    const rawImage =
        (sample && JSON.parse(sample.images)[0]) || "/placeholder.svg";
    const imageUrl =
        rawImage && !rawImage.startsWith("data:")
            ? `${import.meta.env.VITE_API_URL}/${rawImage}`
            : rawImage;

    return (
        <Link
            to={`/variety-reports/${varietyReportId}/variety-sample/${sample.id}`}
            className="bg-white rounded-2xl p-2 flex items-center gap-4 mb-4 drop-shadow-md hover:shadow-xl"
        >
            <div className="w-20 h-20 md:w-28 md:h-28 lg:w-36 lg:h-36   flex-shrink-0 relative">
                {!imgLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-xl">
                        <Leaf className="w-8 h-8 text-gray-500 animate-pulse" />
                    </div>
                )}
                <img
                    src={imageUrl}
                    alt="Variety Sample"
                    loading="lazy"
                    onLoad={() => setImgLoaded(true)}
                    className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
                        imgLoaded ? "opacity-100" : "opacity-0"
                    }`}
                />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="text-md md:text-xl font-medium text-gray-900 mb-1">
                    Sample Date: {sample.sample_date}
                </h3>
                <p className="text-gray-600 text-xs md:text-sm">
                    <strong>Leaf Color:</strong>{" "}
                    {sample.leaf_color.toUpperCase()}
                </p>
                <p className="text-gray-600 text-xs md:text-sm">
                    <strong>Branch Color:</strong>{" "}
                    {sample.branch_color.toUpperCase()}
                </p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
        </Link>
    );
}
