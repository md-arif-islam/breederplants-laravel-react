import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import useContact from "../store/useContactStore";

export default function PublicContactPage() {
    const [formData, setFormData] = useState({
        company_name: "",
        company_email: "",
        company_address: "",
    });
    const { submitContact, loading } = useContact();

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
    }, []);

    return (
        <div className="bg-gray-50 -mt-12 ">
            {/* Content */}
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="min-h-screen bg-white rounded-t-3xl p-4 lg:p-6">
                        <form
                            className="space-y-4 max-w-2xl mx-auto"
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
                                        value={formData.company_name}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                company_name: e.target.value,
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
                                        value={formData.company_email}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                company_email: e.target.value,
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
                                        value={formData.company_address}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                company_address: e.target.value,
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
            </div>
        </div>
    );
}
