import { Loader2 } from "lucide-react";
import { useProductionReportStore } from "../store/useProductionReportStore";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function ProductionReportSubmitPage() {
    const {
        currentProductionReport,
        getProductionReport,
        isLoading,
        submitProductionReport,
    } = useProductionReportStore();

    const { year, quarter } = useParams();
    useEffect(() => {
        getProductionReport(year, quarter);
    }, [getProductionReport, year, quarter]);

    useEffect(() => {
        // page title
        document.title = "Submit Production Reports - Breederplants";
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const data = {};

        for (let [key, value] of formData.entries()) {
            if (key.startsWith("report")) {
                if (!data.report) data.report = {};
                const id = key.match(/\[(.*?)\]/)[1];
                data.report[id] = value;
            } else if (key.startsWith("quantity")) {
                if (!data.quantity) data.quantity = {};
                const id = key.match(/\[(.*?)\]/)[1];
                data.quantity[id] = value;
            } else if (key === "quarter") {
                data.quarter = value;
            } else if (key === "year") {
                data.year = value;
            }
        }

        data.quarters_array = JSON.stringify(
            currentProductionReport?.quarters_array
        );

        console.log(data);

        const res = await submitProductionReport(data);
        if (res.status === 200) {
            navigate("/production-reports");
        }
    };

    return (
        <div className="bg-gray-50 -mt-12">
            {/* Content */}
            <div className="container mx-auto">
                <div className="-mt-12 z-10 relative">
                    <div className="min-h-screen bg-white rounded-t-3xl p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold mb-2">
                            Submit production report for{" "}
                            {currentProductionReport?.quarters_array &&
                                currentProductionReport?.quarters_array.map(
                                    (q, index, array) => (
                                        <span key={index}>
                                            {q.quarter.charAt(0).toUpperCase() +
                                                q.quarter.slice(1)}{" "}
                                            - {q.year}
                                            {index !== array.length - 1
                                                ? ", "
                                                : ""}
                                        </span>
                                    )
                                )}
                        </h2>
                        <p className="text-sm sm:text-base">
                            Please submit your production for the period from{" "}
                            {new Date(
                                currentProductionReport?.start_date
                            ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                            {"  "}
                            up to and including{" "}
                            {new Date(
                                currentProductionReport?.end_date
                            ).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                        <div>
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="hidden"
                                    name="quarter"
                                    value={quarter}
                                />
                                <input type="hidden" name="year" value={year} />
                                <div className="mx-auto py-4 mt-5">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="text-left p-2 sm:p-4 text-sm sm:text-sm font-semibold text-gray-600">
                                                        Name
                                                    </th>

                                                    <th className="text-left p-2 sm:p-4 text-sm sm:text-sm font-semibold text-gray-600">
                                                        Quantity
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentProductionReport &&
                                                    JSON.parse(
                                                        currentProductionReport?.grower_production_reporting_values
                                                    ).map((report, index) => (
                                                        <tr
                                                            key={index}
                                                            className="border-t"
                                                        >
                                                            <td className="p-2 sm:p-4 text-gray-800 text-sm sm:text-sm">
                                                                {report
                                                                    .toUpperCase()
                                                                    .replace(
                                                                        /_/g,
                                                                        " "
                                                                    )}
                                                            </td>

                                                            <td className="p-2 sm:p-4 text-sm sm:text-sm">
                                                                <input
                                                                    type="hidden"
                                                                    name={`report[${report}]`}
                                                                    value={
                                                                        report
                                                                    }
                                                                />

                                                                <input
                                                                    type="number"
                                                                    name={`quantity[${index}]`}
                                                                    placeholder="Enter amount"
                                                                    className="w-full max-w-[200px] px-2 sm:px-3 py-1 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-sm"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="border rounded-full p-2 mt-8">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full text-center align-middle h-12 rounded-full text-sm lg:text-lg bg-primary hover:bg-secondary text-white font-semibold transition-colors flex items-center justify-center"
                                        >
                                            {isLoading ? (
                                                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            ) : (
                                                "Submit Production Report"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
