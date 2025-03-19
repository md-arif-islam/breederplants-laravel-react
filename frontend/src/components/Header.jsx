import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "../store/useStore";
import Notifications from "./Notifications";
import { ChevronLeft, Menu, X } from "lucide-react";
import { PageTitleContext } from "../context/PageTitleContext";

// Helper to get initials from a name
function getInitials(name) {
    if (!name) return "";
    const words = name.split(" ");
    let initials = "";
    for (const word of words) {
        initials += word.charAt(0).toUpperCase();
    }
    return initials;
}

export default function Header() {
    const { authUser, checkAuth } = useStore();
    const [menuOpen, setMenuOpen] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const isIndexPage = location.pathname === "/";
    const { title } = useContext(PageTitleContext);

    // Build nameLogo and userName as before
    let nameLogo = "";
    let userName = "";

    if (authUser?.role === "admin") {
        nameLogo = "A";
        userName = "Admin";
    } else if (authUser?.role === "grower") {
        userName = authUser?.grower?.contact_person || "";
        nameLogo = authUser?.grower?.contact_person
            ? getInitials(authUser.grower.contact_person)
            : "GN";
    } else if (authUser?.role === "breeder") {
        userName = authUser?.breeder?.contact_person || "";
        nameLogo = authUser?.breeder?.contact_person
            ? getInitials(authUser.breeder.contact_person)
            : "BN";
    } else {
        userName = "Role not specified";
    }

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    return (
        <header className="bg-[#4CAF50] text-white p-6 pb-20 relative">
            <div className="container mx-auto flex items-center gap-4 justify-between">
                {/* LEFT COLUMN */}
                {/* take 2 col */}
                <div className="flex items-center gap-4 grid-span-2">
                    {isIndexPage ? (
                        <>
                            <Link
                                to="/"
                                className="w-12 h-12 p-3 bg-[#e9e9e9] rounded-full
                  flex items-center justify-center text-primary font-semibold"
                            >
                                {nameLogo}
                            </Link>

                            <div>
                                <p className="font-poppins font-normal text-[12px] md:text-[14px] leading-[1.00]">
                                    Welcome Back!
                                </p>
                                <Link to="/">
                                    <h2 className="text-base md:text-lg font-semibold font-poppins leading-[1.25]">
                                        {userName}
                                    </h2>
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="py-1">
                            <button
                                className="block focus:outline-none relative"
                                onClick={() => navigate(-1)}
                                aria-label="Go Back"
                            >
                                <ChevronLeft
                                    className="w-8 h-8 md:w-9 md:h-9 text-primary bg-white p-2 rounded-md
                hover:scale-110 transition-transform duration-300"
                                />
                            </button>
                        </div>
                    )}
                </div>

                {/* MIDDLE COLUMN: Only show the page title if NOT on the index page */}
                <div className="text-center">
                    {!isIndexPage && (
                        <h2 className="text-xl md:text-2xl font-semibold">
                            {title}
                        </h2>
                    )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="flex items-center justify-end gap-2">
                    {/* Desktop notifications */}
                    <div className="hidden md:block">
                        <Notifications />
                    </div>

                    {/* Hamburger (mobile only) */}
                    {!isIndexPage ? (
                        // If we are NOT on the index page, show hamburger on the right
                        <button
                            className="block md:hidden focus:outline-none relative"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle Menu"
                        >
                            <Menu
                                className="w-8 h-8 text-primary bg-white p-2 rounded-md
                hover:scale-110 transition-transform duration-300"
                            />
                        </button>
                    ) : (
                        // If we are on the index page, we can still show the hamburger for mobile
                        <button
                            className="block md:hidden focus:outline-none relative"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle Menu"
                        >
                            <Menu
                                className="w-8 h-8 text-primary bg-white p-2 rounded-md
                hover:scale-110 transition-transform duration-300"
                            />
                        </button>
                    )}
                </div>
            </div>

            {/*
        Mobile panel that slides down from the top
        when hamburger is clicked.
      */}
            <div
                className={`fixed top-0 left-0 w-full bg-[#4CAF50] text-white
          transform transition-transform duration-300 ease-in-out
          z-50 p-4
          ${menuOpen ? "translate-y-0" : "-translate-y-full"}`}
            >
                {/* Close icon */}
                <div className="flex justify-end">
                    <button
                        className="text-white font-semibold focus:outline-none"
                        onClick={() => setMenuOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Place anything you want in the mobile menu,
            e.g., <Notifications />, other nav links, etc. */}
                <Notifications />
            </div>
        </header>
    );
}
