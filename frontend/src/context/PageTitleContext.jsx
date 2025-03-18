import React, { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Provide a default value with a no-op setTitle for fallback.
export const PageTitleContext = createContext({
    title: "",
    setTitle: () => {},
});

export function PageTitleProvider({ children }) {
    const [title, setTitle] = useState("");
    const location = useLocation();

    // Reset the title to "" whenever the route changes.
    useEffect(() => {
        setTitle("");
    }, [location.pathname]);

    return (
        <PageTitleContext.Provider value={{ title, setTitle }}>
            {children}
        </PageTitleContext.Provider>
    );
}
