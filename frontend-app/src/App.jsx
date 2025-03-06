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
                    <Route path="/" element={<VarietyReportsPage />} />
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
                        path="sales-reports/create/:year/:quarter"
                        element={<SalesReportSubmitPage />}
                    />

                    <Route
                        path="production-reports/create/:year/:quarter"
                        element={<ProductionReportSubmitPage />}
                    />
                </Route>
            </Routes>
            <Toaster />
        </div>
    );
};

export default App;
