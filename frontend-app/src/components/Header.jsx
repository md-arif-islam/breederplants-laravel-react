import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { ChevronLeft, Mail, Send } from "lucide-react";
import { PageTitleContext } from "../context/PageTitleContext";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const isIndexPage = location.pathname === "/";
    const { title } = useContext(PageTitleContext);

    return (
        <header className="bg-[#4CAF50] text-white p-6 pb-20 relative">
            <div className="container mx-auto flex items-center gap-4 justify-between">
                <div className="flex items-center gap-4 grid-span-2">
                    <div className="py-1">
                        <button
                            className="block focus:outline-none relative"
                            onClick={() => navigate(-1)}
                            aria-label="Go Back"
                        >
                            <ChevronLeft
                                className={`w-8 h-8 md:w-9 md:h-9 text-primary  p-2 rounded-md
                hover:scale-110 transition-transform duration-300 ${
                    isIndexPage ? "bg-gray-200" : "bg-white"
                }`}
                            />
                        </button>
                    </div>
                </div>

                {/* MIDDLE COLUMN: Only show the page title if NOT on the index page */}
                <div className="text-center">
                    <h2 className="text-base md:text-xl font-semibold">
                        {title}
                    </h2>
                </div>

                <div className="flex items-center justify-end gap-2">
                    <button
                        className="block focus:outline-none relative"
                        onClick={() => navigate("/contact")}
                        aria-label="Toggle Menu"
                    >
                        <Mail
                            className="w-8 h-8 md:w-9 md:h-9 text-primary bg-white p-2 rounded-md
                hover:scale-110 transition-transform duration-300"
                        />
                    </button>
                </div>
            </div>
        </header>
    );
}
