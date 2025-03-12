import React, { useEffect } from "react";

export default function Header() {
    useEffect(() => {
        document.title = "Home - Breederplants";
    }, []);

    return (
        <header className="bg-[#4CAF50] text-white p-6 pb-20 relative">
            <div className="container mx-auto flex items-center justify-center">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold">Catalog</h2>
                </div>
            </div>
        </header>
    );
}
