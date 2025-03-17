import { useEffect, useState } from "react";
import FounderIMG from "../assets/images/founder.jpeg";
import CoFounderIMG from "../assets/images/cofounder.jpeg";
import AboutIMG from "../assets/images/about.png";
export default function PublicAboutPage() {
    useEffect(() => {
        document.title = "Contact - Breederplants";
    }, []);

    return (
        <div className="bg-gray-50 -mt-12 ">
            {/* Content */}
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="min-h-screen bg-white rounded-t-3xl p-4 lg:p-6">
                        {/* Founder cards */}
                        <div className="flex space-x-4 mb-6">
                            <div className="relative  rounded-lg overflow-hidden text-center">
                                <img
                                    src={FounderIMG}
                                    alt="Founder"
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute bottom-0 left-0 w-full h-1/2 flex flex-col justify-end items-center bg-gradient-to-b from-transparent to-black/70 p-3 text-white text-center">
                                    <h3 className="font-bold text-xl">
                                        John Doe
                                    </h3>
                                    <p className="text-sm">Founder</p>
                                </div>
                            </div>
                            <div className="relative  rounded-lg overflow-hidden">
                                <img
                                    src={CoFounderIMG}
                                    alt="Co-Founder"
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute bottom-0 left-0 w-full h-1/2 flex flex-col justify-end items-center bg-gradient-to-b from-transparent to-black/70 p-3 text-white text-center">
                                    <h3 className="font-bold text-xl">
                                        John Doe
                                    </h3>
                                    <p className="text-sm">Co-Founder</p>
                                </div>
                            </div>
                        </div>

                        {/* About section */}
                        <div className="px-4 mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                We are Breederplants
                            </h1>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Breederplants is a dedicated organization
                                focused on the protection and introduction of
                                new plant varieties. Established by growers for
                                growers, the company specializes in safeguarding
                                breeder's rights while ensuring that innovative
                                plant species successfully enter the market.
                                With a deep understanding of the horticultural
                                industry, Breederplants.nl provides expert
                                guidance on commercial market assessments,
                                helping breeders determine the potential of
                                their new plant varieties.
                            </p>
                        </div>

                        {/* Plant image */}
                        <div className="relative w-full rounded-lg  mb-6">
                            <img
                                src={AboutIMG}
                                alt="Green plants in pot"
                                className="object-cover w-full h-full rounded-lg"
                            />
                        </div>

                        {/* Services section */}
                        <div className="px-4 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                Our services
                            </h2>

                            <div className="space-y-3">
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-bold text-gray-900">
                                        Commercial Market Assessment
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        We evaluate the market potential of
                                        new...
                                    </p>
                                </div>

                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-bold text-gray-900">
                                        Plant Variety Rights Applications
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        We evaluate the market potential of
                                        new...
                                    </p>
                                </div>

                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-bold text-gray-900">
                                        Test Agreements and Propagation
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        We evaluate the market potential of
                                        new...
                                    </p>
                                </div>

                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-bold text-gray-900">
                                        Prevention of Illegal Propagation
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        We evaluate the market potential of
                                        new...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="px-4 mb-6">
                            <button className="w-full py-4 text-white bg-primary hover:bg-black rounded-lg font-medium">
                                Check our catalog for licenses
                            </button>
                        </div>

                        {/* What we do section */}
                        <div className="px-4 mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                What we do
                            </h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                A key aspect of our work involves managing the
                                application process for Community Plant Variety
                                Rights, ensuring that new cultivars receive the
                                legal protection they deserve. Additionally,
                                they oversee test agreements and propagation
                                contracts, ensuring that new cultivars and
                                regulatory compliance. Beyond the technical
                                aspects, Breederplants.nl actively promotes and
                                educates on plant variety protection standards
                                and regulations.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
