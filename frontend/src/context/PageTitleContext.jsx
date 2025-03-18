import React, { createContext, useState } from "react";

// Create the actual context
export const PageTitleContext = createContext();

// Create a provider component
export function PageTitleProvider({ children }) {
    // This holds the current page title globally
    const [title, setTitle] = useState("");

    // The Provider gives `title` and `setTitle` to any nested components
    return (
        <PageTitleContext.Provider value={{ title, setTitle }}>
            {children}
        </PageTitleContext.Provider>
    );
}
