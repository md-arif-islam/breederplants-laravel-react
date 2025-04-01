import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Download, Leaf } from "lucide-react";
import { useVarietySampleStore } from "../../store/useVarietySampleStore";
import { useNavigate, useParams } from "react-router-dom";
import { Gallery, Item } from "react-photoswipe-gallery";
import { formatDate } from "../../utils/formatDate.js";

// Helper component for lazy loading images with a skeleton placeholder
function LazyImage({ src, alt }) {
    const [imgLoaded, setImgLoaded] = useState(false);

    return (
        <div className="relative w-full h-full">
            {/* Placeholder displayed until image is loaded */}
            {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <Leaf className="w-8 h-8 text-gray-400 animate-pulse" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                }`}
            />
        </div>
    );
}

export default function AdminVarietySampleViewPage() {
    useEffect(() => {
        document.title = "Variety Sample - Breederplants";
    }, []);

    const [showPopup, setShowPopup] = useState(false);
    const { isLoading, getVarietySample, varietySample, deleteVarietySample } =
        useVarietySampleStore();
    const { id, sampleId } = useParams();
    const navigate = useNavigate();

    // Always call getVarietySample hook in the same order
    useEffect(() => {
        getVarietySample(id, sampleId);
    }, [getVarietySample, id, sampleId]);

    // Compute sample images regardless of varietySample status.
    const sampleImages = useMemo(() => {
        return varietySample && varietySample.images
            ? JSON.parse(varietySample.images)
            : [];
    }, [varietySample]);

    // State to store dimensions for each image keyed by index
    const [imgDimensions, setImgDimensions] = useState({});

    // Always call this hook so that the number of hooks stays the same.
    useEffect(() => {
        sampleImages.forEach((imageUrl, index) => {
            const fullImageUrl = `${import.meta.env.VITE_API_URL}/${imageUrl}`;
            const img = new Image();
            img.src = fullImageUrl;
            img.onload = () => {
                setImgDimensions((prev) => ({
                    ...prev,
                    [index]: {
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                    },
                }));
            };
        });
    }, [sampleImages]);

    const handleDelete = (e) => {
        e.preventDefault();
        setShowPopup(true);
    };

    const confirmDelete = async () => {
        setShowPopup(false);
        const response = await deleteVarietySample(id, sampleId);
        if (response.status === 200) {
            navigate(`/admin/variety-reports/${id}`);
        }
    };

    const cancelDelete = () => {
        setShowPopup(false);
    };

    const getFormattedDate = (dateString) => {
        try {
            return formatDate(dateString);
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Invalid Date";
        }
    };

    // Early return for loading state
    if (isLoading || !varietySample) {
        return (
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
                <div className="container mx-auto px-4 py-8"></div>
            </main>
        );
    }

    return (
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
            <div className="container mx-auto px-4 py-8">
                {/* Image Gallery with popup */}
                <Gallery withDownloadButton>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {sampleImages.map((imageUrl, index) => {
                            const fullImageUrl = `${
                                import.meta.env.VITE_API_URL
                            }/${imageUrl}`;
                            const dimensions = imgDimensions[index] || {
                                width: 800,
                                height: 600,
                            };
                            return (
                                <Item
                                    key={index}
                                    original={fullImageUrl}
                                    thumbnail={fullImageUrl}
                                    width={dimensions.width}
                                    height={dimensions.height}
                                    alt={`Sample image ${index + 1}`}
                                >
                                    {({ ref, open }) => (
                                        <div
                                            ref={ref}
                                            onClick={open}
                                            className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                                        >
                                            <LazyImage
                                                src={
                                                    fullImageUrl ||
                                                    "/placeholder.svg"
                                                }
                                                alt={`Sample image ${
                                                    index + 1
                                                }`}
                                            />
                                        </div>
                                    )}
                                </Item>
                            );
                        })}
                    </div>
                </Gallery>

                {/* Sample Details */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Sample Date
                                </h3>
                                <p className="mt-1 uppercase">
                                    {getFormattedDate(
                                        varietySample.sample_date
                                    )}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Leaf Color
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.leaf_color}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Amount of Branches
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.amount_of_branches}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Flower Buds
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.flower_buds}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Branch Color
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.branch_color}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Roots
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.roots}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Flower Color
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.flower_color}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Flower Petals
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.flower_petals}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Flowering Time
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.flowering_time}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Length of Flowering
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.length_of_flowering}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Seeds
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.seeds}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Seed Color
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.seed_color}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">
                                    Amount of Seeds
                                </h3>
                                <p className="mt-1 uppercase">
                                    {varietySample.amount_of_seeds}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-500">
                                Note
                            </h3>
                            <p className="mt-1">{varietySample.note}</p>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button
                                onClick={() =>
                                    navigate(
                                        `/admin/variety-reports/${id}/variety-sample/${sampleId}/edit`
                                    )
                                }
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                            >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </button>
                            <button
                                onClick={handleDelete}
                                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>

                {showPopup && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
                        <div className="bg-white p-4 rounded-md shadow-md">
                            <p>
                                Are you sure you want to delete this variety
                                report?
                            </p>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={confirmDelete}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={cancelDelete}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
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
