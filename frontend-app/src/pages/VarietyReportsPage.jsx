import React, { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

import VarietyReportCard from "../components/VarietyReportCard";
import PlantImg from "../assets/images/big.png";
import { useVarietyReportStore } from "../store/useVarietyReportStore";
import { useStore } from "../store/useStore";

const VarietyReportsPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [sort, setSort] = useState("");
    const [growerId, setGrowerId] = useState("");

    const {
        isLoading,
        getAllVarietyReports,
        varietyReports,
        currentPage,
        totalPages,
        growers,
    } = useVarietyReportStore();

    useEffect(() => {
        getAllVarietyReports(currentPage, searchQuery, sort, growerId);
    }, [currentPage, searchQuery, sort, growerId, getAllVarietyReports]);

    useEffect(() => {
        document.title = "Variety Reports - Breederplants";
    }, []);

    return (
        <div className="bg-gray-50 -mt-12 ">
            {/* Content */}
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="min-h-screen bg-white rounded-t-3xl p-4 lg:p-6">
                        <h2 className="text-xl md:text-2xl font-bold mb-6">
                            Varieties on trial
                        </h2>
                        <div className="grid lg:grid-cols-2 gap-1 lg:gap-4">
                            {varietyReports?.map((report) => (
                                <VarietyReportCard
                                    key={report.id}
                                    report={report}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VarietyReportsPage;
