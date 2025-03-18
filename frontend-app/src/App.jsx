import { useEffect, useRef } from "react";
import { Route, Routes, useLocation, Link } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";

import { Toaster } from "react-hot-toast";
import FrontendLayout from "./layout/FrontendLayout";

import PublicProductsPage from "./pages/PublicProductsPage";
import PublicProductViewPage from "./pages/PublicProductViewPage";
import PublicContactPage from "./pages/PublicContactPage";
import PublicNewsPage from "./pages/PublicNewsPage";
import PublicNewsViewPage from "./pages/PublicNewsViewPage";
// Newly created pages:
import PublicCategoriesPage from "./pages/PublicCategoriesPage";
import PublicTagsPage from "./pages/PublicTagsPage";
import PublicAboutPage from "./pages/PublicAboutPage";
import { PageTitleProvider } from "./context/PageTitleContext";

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
        <PageTitleProvider>
            <div>
                <LoadingBar color="#000" ref={loadingBarRef} />

                <Routes>
                    <Route element={<FrontendLayout />}>
                        <Route path="/" element={<PublicProductsPage />} />
                        <Route
                            path="/products/:id"
                            element={<PublicProductViewPage />}
                        />
                        <Route
                            path="/contact"
                            element={<PublicContactPage />}
                        />
                        <Route path="/about" element={<PublicAboutPage />} />
                        <Route path="/news" element={<PublicNewsPage />} />
                        <Route
                            path="/news/:id"
                            element={<PublicNewsViewPage />}
                        />
                        <Route
                            path="/categories/:slug"
                            element={<PublicCategoriesPage />}
                        />
                        <Route
                            path="/tags/:slug"
                            element={<PublicTagsPage />}
                        />
                    </Route>
                </Routes>
                <Toaster />
            </div>
        </PageTitleProvider>
    );
};

export default App;
