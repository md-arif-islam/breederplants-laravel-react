import { useEffect, useRef } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

import { Toaster } from "react-hot-toast";
import FrontendLayout from "./layout/FrontendLayout";

import PublicProductsPage from "./pages/PublicProductsPage";
import PublicProductViewPage from "./pages/PublicProductViewPage";
import PublicContactPage from "./pages/PublicContactPage";

const App = () => {
    const loadingBarRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
            const timer = setTimeout(() => {
                loadingBarRef.current.complete();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location]);

    return (
        <div>
            <LoadingBar color="#000" ref={loadingBarRef} />
            <Routes>
                <Route element={<FrontendLayout />}>
                    <Route path="/" element={<PublicProductsPage />} />
                    <Route
                        path="/products/:id"
                        element={<PublicProductViewPage />}
                    />

                    <Route path="/contact" element={<PublicContactPage />} />
                </Route>
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
