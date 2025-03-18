import { Loader2 } from "lucide-react";
import { useProductionReportStore } from "../store/useProductionReportStore";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect } from "react";
import { PageTitleContext } from "../context/PageTitleContext";

export default function ProductionReportSubmitPage() {
    const {
        currentProductionReport,
        getProductionReport,
        isLoading,
        submitProductionReport,
    } = useProductionReportStore();

    const { year, quarter } = useParams();
    const { setTitle } = useContext(PageTitleContext);

    useEffect(() => {
        getProductionReport(year, quarter);
    }, [getProductionReport, year, quarter]);

    useEffect(() => {
        // page title
        document.title = "Submit Production Reports - Breederplants";
        setTitle("Submit Production Reports");
    }, [setTitle]);

    const navigate = useNavigate();

    // Parse reporting values once
    const reportingValues = currentProductionReport
        ? JSON.parse(currentProductionReport.grower_production_reporting_values)
        : [];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        // Build an object keyed by product_id containing the report field values
        const productionDataMap = {};

        // First, process product name inputs
        for (let [key, value] of formData.entries()) {
            if (key.startsWith("prod_name")) {
                // Key pattern: prod_name[product_id]
                const match = key.match(/prod_name\[(.*?)\]/);
                if (match) {
                    const productId = match[1];
                    if (!productionDataMap[productId]) {
                        productionDataMap[productId] = {
                            product_id: productId,
                        };
                    }
                    productionDataMap[productId]["product_name"] = value;
                }
            }
        }

        // Next, process quantity inputs (the numbers entered by the user)
        for (let [key, value] of formData.entries()) {
            if (key.startsWith("quantity")) {
                // Key format: quantity[product_id][report_field]
                const match = key.match(/quantity\[(.*?)\]\[(.*?)\]/);
                if (match) {
                    const productId = match[1];
                    const field = match[2];
                    if (!productionDataMap[productId]) {
                        productionDataMap[productId] = {
                            product_id: productId,
                        };
                    }
                    // Save 0 if the input is empty, otherwise save the actual value.
                    productionDataMap[productId][field] =
                        value.trim() === "" ? 0 : value;
                }
            }
        }

        // Convert the map to an array
        const productionData = Object.values(productionDataMap);

        // Prepare the final data payload
        const data = {
            quarter: formData.get("quarter"),
            year: formData.get("year"),
            quarters_array: JSON.stringify(
                currentProductionReport?.quarters_array
            ),
            production: productionData,
        };

        console.log("Final data payload:", data);

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
                                [...currentProductionReport.quarters_array]
                                    .reverse()
                                    .map((q, index, array) => (
                                        <span key={index}>
                                            {q.quarter.charAt(0).toUpperCase() +
                                                q.quarter.slice(1)}{" "}
                                            - {q.year}
                                            {index !== array.length - 1
                                                ? ", "
                                                : ""}
                                        </span>
                                    ))}
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
                                                        Product Name
                                                    </th>

                                                    {reportingValues.map(
                                                        (report, index) => (
                                                            <th
                                                                key={index}
                                                                className="text-left p-2 sm:p-4 text-sm sm:text-sm font-semibold text-gray-600"
                                                            >
                                                                {report
                                                                    .toUpperCase()
                                                                    .replace(
                                                                        /_/g,
                                                                        " "
                                                                    )}
                                                            </th>
                                                        )
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentProductionReport &&
                                                    currentProductionReport.grower_products.map(
                                                        (prod, index) => (
                                                            <tr
                                                                key={index}
                                                                className="border-t"
                                                            >
                                                                <td className="p-2 sm:p-4 text-gray-800 text-sm sm:text-sm">
                                                                    <input
                                                                        type="hidden"
                                                                        name={`prod_name[${prod.product.id}]`}
                                                                        value={
                                                                            prod
                                                                                .product
                                                                                .cultivar
                                                                        }
                                                                    />
                                                                    {
                                                                        prod
                                                                            .product
                                                                            .cultivar
                                                                    }
                                                                </td>
                                                                {reportingValues.map(
                                                                    (
                                                                        report,
                                                                        i
                                                                    ) => (
                                                                        <td
                                                                            key={
                                                                                i
                                                                            }
                                                                            className="p-2 sm:p-4 text-sm sm:text-sm"
                                                                        >
                                                                            <input
                                                                                type="hidden"
                                                                                name={`report[${prod.product.id}][${report}]`}
                                                                                value={
                                                                                    report
                                                                                }
                                                                            />
                                                                            <input
                                                                                type="number"
                                                                                name={`quantity[${prod.product.id}][${report}]`}
                                                                                placeholder="Enter amount"
                                                                                className="w-full max-w-[200px] px-2 sm:px-3 py-1 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-sm"
                                                                            />
                                                                        </td>
                                                                    )
                                                                )}
                                                            </tr>
                                                        )
                                                    )}
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
