import React, { useEffect } from "react";
import Notifications from "./Notifications";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";

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
    useEffect(() => {
        document.title = "Home - Breederplants";
    }, []);

    return (
        <header className="bg-[#4CAF50] text-white p-6 pb-20 relative">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="w-12 h-12 bg-[#e9e9e9] rounded-full flex items-center justify-center text-primary font-semibold"
                    >
                        U
                    </Link>
                    <div>
                        <p className="font-poppins font-normal text-[12px] md:text-[14px] leading-[1.00]">
                            Welcome Back!
                        </p>
                        <Link to="/">
                            <h2 className="text-base md:text-lg font-semibold font-poppins leading-[1.25]">
                                User
                            </h2>
                        </Link>
                    </div>
                </div>
                <Notifications />
            </div>
        </header>
    );
}
