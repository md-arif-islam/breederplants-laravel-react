import { useContext, useEffect, useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import useContact from "../store/useContactStore";
import { PageTitleContext } from "../context/PageTitleContext";
import ContactGIF from "../assets/images/contact.gif";
import AboutIMG from "../assets/images/about.png";

// LazyImage component: wraps an image with lazy loading and a placeholder skeleton.
function LazyImage({ src, alt, className = "", containerClassName = "" }) {
    const [loaded, setLoaded] = useState(false);
    return (
        <div className={`relative ${containerClassName}`}>
            {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    {/* You can add an icon or spinner here if needed */}
                </div>
            )}
            <img
                src={src}
                alt={alt}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`${className} transition-opacity duration-300 ${
                    loaded ? "opacity-100" : "opacity-0"
                }`}
            />
        </div>
    );
}

export default function PublicContactPage() {
    const [formData, setFormData] = useState({
        company_name: "",
        company_email: "",
        company_address: "",
    });
    const { submitContact, loading } = useContact();
    const { setTitle } = useContext(PageTitleContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await submitContact(formData);
            toast.success(res.message);
            setFormData({
                company_name: "",
                company_email: "",
                company_address: "",
            });
        } catch (err) {
            toast.error("Submission failed");
        }
    };

    useEffect(() => {
        document.title = "Contact - Breederplants";
        setTitle("Contact with us");
    }, [setTitle]);

    return (
        <div className="bg-gray-50 -mt-12 ">
            {/* Content */}
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="min-h-screen bg-white rounded-t-3xl p-4 lg:p-6">
                        <div className="">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                                        Contact
                                    </div>
                                    <h2 className="text-base md:text-xl font-bold text-gray-900 mb-6">
                                        Send us a message!
                                    </h2>
                                    <div className="space-y-6 text-gray-700 text-sm md:text-base">
                                        <form
                                            className="space-y-4 mx-auto mt-5"
                                            onSubmit={handleSubmit}
                                        >
                                            <div className="space-y-4">
                                                <div>
                                                    <label
                                                        htmlFor="company_name"
                                                        className="block mb-2"
                                                    >
                                                        Company Name
                                                    </label>
                                                    <input
                                                        id="company_name"
                                                        type="text"
                                                        placeholder="Company Name"
                                                        required
                                                        className="border border-gray-700 border-opacity-20 rounded-full text-[#292d32] font-poppins text-sm w-full h-14 px-6 focus:outline-none focus:ring-2 focus:ring-primary"
                                                        value={
                                                            formData.company_name
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                company_name:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="company_email"
                                                        className="block mb-2"
                                                    >
                                                        Company Email
                                                    </label>
                                                    <input
                                                        id="company_email"
                                                        type="email"
                                                        placeholder="Company Email"
                                                        required
                                                        className="border border-gray-700 border-opacity-20 rounded-full text-[#292d32] font-poppins text-sm w-full h-14 px-6 focus:outline-none focus:ring-2 focus:ring-primary"
                                                        value={
                                                            formData.company_email
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                company_email:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div>
                                                    <label
                                                        htmlFor="company_address"
                                                        className="block mb-2"
                                                    >
                                                        Company Address
                                                    </label>
                                                    <input
                                                        id="company_address"
                                                        type="text"
                                                        placeholder="Company Address"
                                                        required
                                                        className="border border-gray-700 border-opacity-20 rounded-full text-[#292d32] font-poppins text-sm w-full h-14 px-6 focus:outline-none focus:ring-2 focus:ring-primary"
                                                        value={
                                                            formData.company_address
                                                        }
                                                        onChange={(e) =>
                                                            setFormData({
                                                                ...formData,
                                                                company_address:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="border rounded-full p-2">
                                                <button
                                                    type="submit"
                                                    className="w-full h-12 rounded-full text-lg bg-primary hover:bg-secondary text-white font-bold transition-colors flex items-center justify-center"
                                                    disabled={loading}
                                                >
                                                    {loading ? (
                                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                                    ) : (
                                                        "Submit"
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <div className="relative rounded-xl overflow-hidden h-[500px]">
                                    <LazyImage
                                        src={AboutIMG}
                                        alt="Green plants in pot"
                                        containerClassName=""
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
