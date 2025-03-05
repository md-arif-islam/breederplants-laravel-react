import { Leaf, PenBox } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useVarietySampleStore } from "../store/useVarietySampleStore";
import prevIcon from "../assets/images/icon-previous.svg";
import nextIcon from "../assets/images/icon-next.svg";

export default function VarietySampleShow() {
    const [currImg, setCurrImg] = useState(0);
    // Replace global imgLoaded with an object to track each image's load status
    const [loadedImages, setLoadedImages] = useState({});
    const { isLoading, getUserVarietySample, varietySample } =
        useVarietySampleStore();
    const { id, sampleId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        getUserVarietySample(id, sampleId);
    }, [getUserVarietySample, id, sampleId]);

    useEffect(() => {
        if (varietySample?.variety_report) {
            document.title =
                varietySample?.variety_report?.variety_name +
                " - Breederplants";
        }
    }, [varietySample]);

    useEffect(() => {
        document.title = "Variety Sample Details - Breederplants";
    }, []);

    if (isLoading || !varietySample) {
        return <div></div>;
    }

    const sampleImages = varietySample.images
        ? JSON.parse(varietySample.images)
        : [];
    const placeholder =
        "https://portal.breederplants.nl/assets/backend/imgs/products/blank_product.gif";
    // Map each image so that if it isn't a base64 string, we prepend the API URL.
    const images = sampleImages.length
        ? sampleImages.map((img) =>
              img.startsWith("data:")
                  ? img
                  : `${import.meta.env.VITE_API_URL}/${img}`
          )
        : [placeholder];

    const prevImg = () => {
        setCurrImg(currImg === 0 ? images.length - 1 : currImg - 1);
    };

    const nextImg = () => {
        setCurrImg(currImg >= images.length - 1 ? 0 : currImg + 1);
    };

    const handleImgLoad = (index) => {
        setLoadedImages((prev) => ({ ...prev, [index]: true }));
    };

    return (
        <div className="bg-gray-50 -mt-12">
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="bg-white rounded-t-3xl p-4 lg:p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-10">
                            {/* Image Slider */}
                            <div className="relative col-span-2 flex justify-center align-middle flex-col">
                                <div className="relative">
                                    {!loadedImages[currImg] && (
                                        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-gray-200">
                                            <Leaf className="w-6 h-6 text-gray-400 animate-pulse" />
                                        </div>
                                    )}
                                    <a
                                        className="popup-link"
                                        href={images[currImg]}
                                    >
                                        <img
                                            src={images[currImg]}
                                            alt="sample"
                                            loading="lazy"
                                            onLoad={() =>
                                                handleImgLoad(currImg)
                                            }
                                            className={`block w-full max-w-full rounded-xl cursor-pointer transition-opacity duration-300 ${
                                                loadedImages[currImg]
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            }`}
                                        />
                                    </a>
                                </div>

                                <div className="grid grid-cols-3 gap-2 lg:grid-cols-4 mt-5">
                                    {images.map((image, index) => (
                                        <div
                                            key={image + index}
                                            className={`rounded-xl relative ${
                                                index === currImg &&
                                                "outline outline-primary"
                                            }`}
                                        >
                                            {!loadedImages[index] && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                                    <Leaf className="w-6 h-6 text-gray-400 animate-pulse" />
                                                </div>
                                            )}
                                            <img
                                                src={image}
                                                alt="sample thumbnail"
                                                loading="lazy"
                                                onLoad={() =>
                                                    handleImgLoad(index)
                                                }
                                                className={`object-cover w-full h-32 rounded-lg transition-all duration-300 hover:cursor-pointer hover:opacity-40 ${
                                                    index === currImg
                                                        ? "opacity-40"
                                                        : loadedImages[index]
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                }`}
                                                onClick={() =>
                                                    setCurrImg(index)
                                                }
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="relative col-span-3">
                                <h2 className="text-xl font-bold mb-4 mt-6 lg:mt-0">
                                    Sample Date : {varietySample?.sample_date}
                                </h2>
                                <div className="grid grid-cols-2 gap-y-1 p-2">
                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Leaf Color
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.leaf_color?.toUpperCase()}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Amount of Branches
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.amount_of_branches}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Flower Buds
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.flower_buds}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Branch Color
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.branch_color?.toUpperCase()}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Roots
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.roots?.toUpperCase()}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Flower Color
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.flower_color?.toUpperCase()}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Flower Petals
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.flower_petals}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Flowering Time
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.flowering_time}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Length of Flowering
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.length_of_flowering}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Seeds
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.seeds?.toUpperCase()}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Seed Color
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.seed_color?.toUpperCase()}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Amount of Seeds
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.amount_of_seeds}
                                    </span>

                                    <span className="text-gray-600 font-medium text-sm md:text-sm">
                                        Note
                                    </span>
                                    <span className="text-gray-900 font-semibold text-right text-sm md:text-sm">
                                        {varietySample?.note}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="border rounded-full p-1 mt-4">
                            <Link
                                to={`/variety-reports/${id}/variety-sample/${sampleId}/edit`}
                                className="w-full text-center align-middle h-10 rounded-full text-sm bg-primary hover:bg-secondary text-white font-semibold transition-colors flex items-center justify-center"
                            >
                                <PenBox className="w-4 h-4 mr-2" />
                                Change
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
