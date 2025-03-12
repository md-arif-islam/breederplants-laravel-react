import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Leaf } from "lucide-react";

export default function ProductCard({ product }) {
    const [imgLoaded, setImgLoaded] = useState(false); // state to track image load

    const rawImage =
        (product && JSON.parse(product.images)[0]) || "/placeholder.svg";
    const imageUrl =
        rawImage && !rawImage.startsWith("data:")
            ? `${import.meta.env.VITE_API_URL}/${rawImage}`
            : rawImage;

    return (
        <Link
            to={`/products/${product.id}`}
            className="bg-white rounded-2xl p-2 flex items-center gap-4 mb-4 drop-shadow-md hover:shadow-xl"
        >
            <div className="w-20 h-20 lg:w-28 lg:h-28 flex-shrink-0 relative">
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
                <p className="text-sm md:text-xl font-semibold text-gray-900 mb-1">
                    {product?.genus} {product?.species} {product?.cultivar}
                </p>
                <p className="text-sm md:text-sm font-semibold text-gray-500 mb-1">
                    {product?.description && product.description.length > 50
                        ? product.description.substring(0, 50) + "..."
                        : product?.description}
                </p>
            </div>
            <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
        </Link>
    );
}
