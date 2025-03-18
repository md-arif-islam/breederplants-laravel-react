import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";

export default function FrontendLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            {/* Main content */}
            <main className="flex-grow pb-20 md:pb-24">
                <Outlet />
            </main>
            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    );
}
