import React, { useEffect, useState } from "react";
import Notifications from "./Notifications";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { EyeClosed, HamIcon, Menu, MenuIcon, X } from "lucide-react";

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

    useEffect(() => {
        document.title = "Home - Breederplants";
    }, []);

    return (
        <header className="bg-[#4CAF50] text-white p-6 pb-20 relative">
            <div className="container mx-auto flex items-center justify-between">
                {/* Left side: Logo + user name */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="w-12 h-12 bg-[#e9e9e9] rounded-full flex items-center justify-center text-primary font-semibold"
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
                </div>

                {/* Desktop notifications/icons */}
                <div className="hidden md:block">
                    <Notifications />
                </div>

                {/* Hamburger button (mobile only) */}
                <button
                    className="block md:hidden focus:outline-none relative w-8 h-6"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle Menu"
                >
                    <Menu className="w-8 h-8" />
                </button>
            </div>

            {/*
        Off-screen "canvas" from the TOP.
        Slides down via translateY(-100%) -> translateY(0).
        Full width, so you can place your entire menu / notifications.
      */}
            <div
                className={`fixed top-0 left-0 w-full bg-[#4CAF50] text-white
                    transform transition-transform duration-300 ease-in-out
                    z-50 p-4
                    ${menuOpen ? "translate-y-0" : "-translate-y-full"}`}
            >
                {/* Wrapper for close button to align at the right */}
                <div className="flex justify-end">
                    <button
                        className="text-white font-semibold focus:outline-none"
                        onClick={() => setMenuOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <Notifications />
            </div>
        </header>
    );
}
