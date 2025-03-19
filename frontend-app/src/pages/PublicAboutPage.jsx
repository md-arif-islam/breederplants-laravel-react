import { useContext, useEffect, useState } from "react";
import FounderIMG from "../assets/images/founder.jpeg";
import CoFounderIMG from "../assets/images/cofounder.jpeg";
import AboutIMG from "../assets/images/about.png";
import { PageTitleContext } from "../context/PageTitleContext";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
    const { setTitle } = useContext(PageTitleContext);

    useEffect(() => {
        document.title = "About Us - Breederplants";
        setTitle("About Us");
    }, [setTitle]);

    const navigate = useNavigate();

    return (
        <div className="bg-gray-50 -mt-12 ">
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden p-4 lg:p-6">
                        <div className="relative pb-10">
                            <div className="max-w-2xl">
                                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                                    We are{" "}
                                    <span className="text-primary">
                                        Breederplants
                                    </span>
                                </h1>
                                <p className="text-gray-700 text-sm md:text-base max-w-2xl">
                                    Established by growers for growers, we
                                    specialize in safeguarding breeder's rights
                                    while ensuring innovative plant species
                                    successfully enter the market.
                                </p>
                            </div>
                            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-48 h-48 text-primary"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                                    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                                </svg>
                            </div>
                        </div>

                        {/* Team Section */}
                        <div className="">
                            <div className="flex items-center mb-8">
                                <div className="h-px bg-gray-200 flex-grow"></div>
                                <h2 className="text-lg md:text-2xl font-bold text-gray-900 px-4">
                                    Our Team
                                </h2>
                                <div className="h-px bg-gray-200 flex-grow"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Founder */}
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm h-full">
                                    <div className="relative">
                                        <img
                                            src={FounderIMG}
                                            alt="John Doe"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-base md:text-xl font-bold text-gray-900">
                                            John Doe
                                        </h3>
                                        <p className="text-sm md:text-base text-primary font-medium mb-4">
                                            Founder
                                        </p>
                                        <p className="text-sm md:text-base text-gray-600">
                                            With over 15 years of experience in
                                            horticulture, John leads our mission
                                            to protect and promote innovative
                                            plant varieties.
                                        </p>
                                    </div>
                                </div>

                                {/* Co-Founder */}
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm h-full">
                                    <div className="relative ">
                                        <img
                                            src={CoFounderIMG}
                                            alt="Jane Smith"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-base md:text-xl font-bold text-gray-900">
                                            Jane Smith
                                        </h3>
                                        <p className="text-sm md:text-base text-primary font-medium mb-4">
                                            Co-Founder
                                        </p>
                                        <p className="text-sm md:text-base text-gray-600">
                                            Jane brings expertise in plant
                                            genetics and international plant
                                            variety rights, ensuring our clients
                                            receive the best guidance.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* About Section */}
                        <div className="py-16">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                                        Our Mission
                                    </div>
                                    <h2 className="text-base md:text-xl font-bold text-gray-900 mb-6">
                                        Protecting Innovation in Plant Breeding
                                    </h2>
                                    <div className="space-y-6 text-gray-700 text-sm md:text-base">
                                        <p>
                                            Breederplants is a dedicated
                                            organization focused on the
                                            protection and introduction of new
                                            plant varieties. With a deep
                                            understanding of the horticultural
                                            industry, we provide expert guidance
                                            on commercial market assessments,
                                            helping breeders determine the
                                            potential of their new plant
                                            varieties.
                                        </p>
                                        <p>
                                            A key aspect of our work involves
                                            managing the application process for
                                            Community Plant Variety Rights,
                                            ensuring that new cultivars receive
                                            the legal protection they deserve.
                                            Additionally, we oversee test
                                            agreements and propagation
                                            contracts, ensuring regulatory
                                            compliance.
                                        </p>
                                        <p>
                                            Beyond the technical aspects,
                                            Breederplants actively promotes and
                                            educates on plant variety protection
                                            standards and regulations.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative rounded-xl overflow-hidden h-[500px]">
                                    <img
                                        src={AboutIMG}
                                        alt="Green plants in pot"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Services Section */}
                        <div className="py-16">
                            <div className="text-center mb-12">
                                <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium mb-4">
                                    What We Offer
                                </div>
                                <h2 className="text-base md:text-xl font-bold text-gray-900">
                                    Our Services
                                </h2>
                                <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                                    We provide comprehensive support for plant
                                    breeders, from market assessment to legal
                                    protection.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Service 1 */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all hover:shadow-md h-full">
                                    <div className="bg-emerald-100 text-emerald-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="11" cy="11" r="8" />
                                            <path d="m21 21-4.3-4.3" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">
                                        Commercial Market Assessment
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-600">
                                        We evaluate the market potential of new
                                        plant varieties, helping breeders make
                                        informed decisions about
                                        commercialization.
                                    </p>
                                </div>

                                {/* Service 2 */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all hover:shadow-md h-full">
                                    <div className="bg-emerald-100 text-emerald-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">
                                        Plant Variety Rights Applications
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-600">
                                        We manage the entire application process
                                        for Community Plant Variety Rights,
                                        ensuring proper legal protection.
                                    </p>
                                </div>

                                {/* Service 3 */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all hover:shadow-md h-full">
                                    <div className="bg-emerald-100 text-emerald-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <path d="M14 2v6h6" />
                                            <path d="m9 15 2 2 4-4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">
                                        Test Agreements and Propagation
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-600">
                                        We oversee test agreements and
                                        propagation contracts, ensuring
                                        compliance with regulations and
                                        protecting breeder interests.
                                    </p>
                                </div>

                                {/* Service 4 */}
                                <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm transition-all hover:shadow-md h-full">
                                    <div className="bg-emerald-100 text-emerald-700 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="8" r="6" />
                                            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-2">
                                        Prevention of Illegal Propagation
                                    </h3>
                                    <p className="text-sm md:text-base text-gray-600">
                                        We implement strategies to prevent
                                        unauthorized propagation, protecting the
                                        intellectual property of plant breeders.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="py-16 bg-gradient-to-r from-primary to-green-600 text-white rounded-lg px-10">
                            <div className="max-w-2xl mx-auto text-center">
                                <h2 className="text-xl md:text-2xl font-bold mb-6">
                                    Ready to protect your plant innovations?
                                </h2>
                                <p className="text-emerald-50 mb-8">
                                    Explore our catalog of available licenses or
                                    contact us to discuss how we can help
                                    protect and commercialize your new plant
                                    varieties.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => navigate("/")}
                                        className="px-6 py-3 bg-white text-emerald-700 font-medium rounded-lg hover:bg-emerald-50 transition-colors"
                                    >
                                        Check our catalog
                                    </button>
                                    <button
                                        onClick={() => navigate("/contact")}
                                        className="px-6 py-3 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-gray-700 transition-colors"
                                    >
                                        Contact us
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
