import { Leaf } from "lucide-react";

import VarietyReportCard from "../components/VarietyReportCard";
import PlantImg from "../assets/images/big.png";
import { useVarietyReportStore } from "../store/useVarietyReportStore";
import { useStore } from "../store/useStore";
import { useEffect } from "react";

export default function VarietiesPage() {
  const { varietyReports, getVarietyReportsByUser } = useVarietyReportStore();
  const { authUser } = useStore();

  useEffect(() => {
    getVarietyReportsByUser(authUser.id);
  }, [authUser.id, getVarietyReportsByUser]);

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
                <VarietyReportCard key={report.id} report={report} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
