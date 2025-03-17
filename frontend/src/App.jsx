import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar";

import LoginPage from "./pages/LoginPage";
import VarietyReportsPage from "./pages/VarietyReportsPage";
import VarietyReportShow from "./pages/VarietyReportShowPage";

import Header from "./components/Header";
import { Toaster } from "react-hot-toast";
import FrontendLayout from "./layout/FrontendLayout";
import BackendLayout from "./layout/BackendLayout";
import AdminDashboardPage from "./pages/backend/AdminDashboardPage";
import AdminVarietyReportsPage from "./pages/backend/AdminVarietyReportsPage";
import AdminVarietyReportViewPage from "./pages/backend/AdminVarietyReportViewPage";
import AdminVarietySampleViewPage from "./pages/backend/AdminVarietySampleViewPage";
import AdminVarietyReportCreatePage from "./pages/backend/AdminVarietyReportCreatePage";
import { useStore } from "./store/useStore";
import { Loader } from "lucide-react";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AdminGrowerPage from "./pages/backend/AdminGrowersPage";
import AdminGrowerViewPage from "./pages/backend/AdminGrowerViewPage";
import AdminGrowerEditPage from "./pages/backend/AdminGrowerEditPage";
import AdminGrowerCreatePage from "./pages/backend/AdminGrowerCreatePage";
import AdminBreederPage from "./pages/backend/AdminBreedersPage";
import AdminBreederViewPage from "./pages/backend/AdminBreederViewPage";
import AdminBreederEditPage from "./pages/backend/AdminBreederEditPage";
import AdminBreederCreatePage from "./pages/backend/AdminBreederCreatePage";
import AdminVarietyReportUpdatePage from "./pages/backend/AdminVarietyReportUpdatePage";
import AdminVarietySampleUpdatePage from "./pages/backend/AdminVarietySampleUpdatePage";
import AdminVarietySampleCreatePage from "./pages/backend/AdminVarietySampleCreatePage";
import AdminRoute from "./components/AdminRoute";
import VarietySampleShow from "./pages/VarietySampleShowPage";
import VarietySampleCreatePage from "./pages/VarietySampleCreatePage";
import VarietySampleUpdatePage from "./pages/VarietySampleUpdatePage";
import AdminProductsPage from "./pages/backend/AdminProductsPage";
import AdminProductViewPage from "./pages/backend/AdminProductViewPage";
import AdminProductEditPage from "./pages/backend/AdminProductEditPage";
import AdminProductCreatePage from "./pages/backend/AdminProductCreatePage";
import AdminGrowerProductsPage from "./pages/backend/AdminGrowerProductsPage";
import SalesReportsPage from "./pages/SalesReportsPage";
import SalesReportSubmitPage from "./pages/SalesReportSubmitPage";
import UserRoute from "./components/UserRoute";
import AdminSalesReportsPage from "./pages/backend/AdminSalesReportsPage";
import AdminSalesReportViewPage from "./pages/backend/AdminSalesReportViewPage";
import AdminProductionReportsPage from "./pages/backend/AdminProductionReportsPage";
import ProductionReportsPage from "./pages/ProductionReportsPage";
import ProductionReportSubmitPage from "./pages/ProductionReportSubmitPage";
import AdminProductionReportViewPage from "./pages/backend/AdminProductReportViewPage";
import AdminBreederProductsPage from "./pages/backend/AdminBreederProductsPage";
import AdminNewsPage from "./pages/backend/AdminNewsPage";
import AdminNewsViewPage from "./pages/backend/AdminNewsViewPage";
import AdminNewsUpdatePage from "./pages/backend/AdminNewsUpdatePage";
import AdminNewsCreatePage from "./pages/backend/AdminNewsCreatePage"; // Import the new page
import AdminNewsCategoriesPage from "./pages/backend/AdminNewsCategoriesPage";
import AdminNewsTagsPage from "./pages/backend/AdminNewsTagsPage";

const App = () => {
    const { authUser, isCheckingAuth, checkAuth } = useStore();

    const loadingBarRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (loadingBarRef.current) {
            loadingBarRef.current.continuousStart();
            const timer = setTimeout(() => {
                loadingBarRef.current.complete();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [location, authUser]);

    if (isCheckingAuth && !authUser)
        return (
            <div className="flex items-center justify-center h-screen">
                {/* <Loader className="size-10 animate-spin" /> */}
            </div>
        );

    return (
        <div>
            <LoadingBar color="#000" ref={loadingBarRef} />
            <Routes>
                {/* Auth */}
                <Route
                    path="/login"
                    element={
                        authUser ? (
                            <Navigate to={location.state?.from || "/"} />
                        ) : (
                            <LoginPage />
                        )
                    }
                />

                <Route
                    path="/forgot-password"
                    element={
                        !authUser ? <ForgotPasswordPage /> : <Navigate to="/" />
                    }
                />

                <Route
                    path="/reset-password"
                    element={
                        !authUser ? <ResetPasswordPage /> : <Navigate to="/" />
                    }
                />

                {/* Frontend Routes with Header */}
                <Route
                    element={
                        <UserRoute>
                            <FrontendLayout />
                        </UserRoute>
                    }
                >
                    <Route
                        path="/"
                        element={
                            authUser ? (
                                <VarietyReportsPage />
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />
                    <Route
                        path="/variety-reports/:id"
                        element={<VarietyReportShow />}
                    />
                    <Route
                        path="variety-reports/:id/variety-sample/:sampleId"
                        element={<VarietySampleShow />}
                    />
                    <Route
                        path="variety-reports/:id/variety-sample/create"
                        element={<VarietySampleCreatePage />}
                    />

                    <Route
                        path="variety-reports/:id/variety-sample/:sampleId/edit"
                        element={<VarietySampleUpdatePage />}
                    />

                    <Route
                        path="sales-reports"
                        element={
                            authUser?.role == "admin" ? (
                                <Navigate to="/admin/sales-reports" />
                            ) : (
                                <SalesReportsPage />
                            )
                        }
                    />

                    <Route
                        path="sales-reports/create/:year/:quarter"
                        element={<SalesReportSubmitPage />}
                    />

                    <Route
                        path="production-reports"
                        element={
                            authUser?.role == "admin" ? (
                                <Navigate to="/admin/production-reports" />
                            ) : (
                                <ProductionReportsPage />
                            )
                        }
                    />

                    <Route
                        path="production-reports/create/:year/:quarter"
                        element={<ProductionReportSubmitPage />}
                    />
                </Route>

                {/* Backend (Admin) Routes without Header */}
                <Route
                    path="/admin"
                    element={
                        !authUser ? (
                            <Navigate to="/login" />
                        ) : (
                            <AdminRoute>
                                <BackendLayout />
                            </AdminRoute>
                        )
                    }
                >
                    <Route path="dashboard" element={<AdminDashboardPage />} />
                    <Route
                        path="variety-reports"
                        element={<AdminVarietyReportsPage />}
                    />
                    <Route
                        path="variety-reports/create"
                        element={<AdminVarietyReportCreatePage />}
                    />
                    <Route
                        path="variety-reports/:id"
                        element={<AdminVarietyReportViewPage />}
                    />
                    <Route
                        path="variety-reports/:id/edit"
                        element={<AdminVarietyReportUpdatePage />}
                    />
                    <Route
                        path="variety-reports/:id/variety-sample/:sampleId"
                        element={<AdminVarietySampleViewPage />}
                    />
                    <Route
                        path="variety-reports/:id/variety-sample/create"
                        element={<AdminVarietySampleCreatePage />}
                    />
                    <Route
                        path="variety-reports/:id/variety-sample/:sampleId/edit"
                        element={<AdminVarietySampleUpdatePage />}
                    />
                    <Route path="growers" element={<AdminGrowerPage />} />
                    <Route
                        path="growers/:id"
                        element={<AdminGrowerViewPage />}
                    />
                    <Route
                        path="growers/:id/edit"
                        element={<AdminGrowerEditPage />}
                    />
                    <Route
                        path="growers/create"
                        element={<AdminGrowerCreatePage />}
                    />
                    <Route
                        path="growers/:id/products"
                        element={<AdminGrowerProductsPage />}
                    />
                    <Route path="breeders" element={<AdminBreederPage />} />
                    <Route
                        path="breeders/:id"
                        element={<AdminBreederViewPage />}
                    />
                    <Route
                        path="breeders/:id/edit"
                        element={<AdminBreederEditPage />}
                    />
                    <Route
                        path="breeders/create"
                        element={<AdminBreederCreatePage />}
                    />
                    <Route
                        path="breeders/:id/products"
                        element={<AdminBreederProductsPage />}
                    />
                    <Route path="products" element={<AdminProductsPage />} />
                    <Route
                        path="products/:id"
                        element={<AdminProductViewPage />}
                    />
                    <Route
                        path="products/:id/edit"
                        element={<AdminProductEditPage />}
                    />
                    <Route
                        path="products/create"
                        element={<AdminProductCreatePage />}
                    />
                    <Route
                        path="sales-reports"
                        element={<AdminSalesReportsPage />}
                    />
                    <Route
                        path="sales-reports/:id"
                        element={<AdminSalesReportViewPage />}
                    />
                    <Route
                        path="production-reports"
                        element={<AdminProductionReportsPage />}
                    />
                    <Route
                        path="production-reports/:id"
                        element={<AdminProductionReportViewPage />}
                    />
                    <Route path="news" element={<AdminNewsPage />} />
                    <Route
                        path="news/categories"
                        element={<AdminNewsCategoriesPage />}
                    />
                    <Route path="news/:id" element={<AdminNewsTagsPage />} />
                    <Route
                        path="news/:id/edit"
                        element={<AdminNewsUpdatePage />}
                    />
                    <Route
                        path="news/create"
                        element={<AdminNewsCreatePage />}
                    />{" "}
                    {/* Add the new route */}
                </Route>
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
