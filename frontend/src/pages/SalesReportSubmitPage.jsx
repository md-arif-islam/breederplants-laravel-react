import { Loader2 } from "lucide-react";
import { useSalesReportStore } from "../store/useSalesReportStore";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function SalesReportSubmitPage() {
  const { currentSalesReport, getSalesReport, isLoading, submitSalesReport } =
    useSalesReportStore();

  const { year, quarter } = useParams();
  useEffect(() => {
    getSalesReport(year, quarter);
  }, [getSalesReport, year, quarter]);

  useEffect(() => {
    // page title
    document.title = "Submit Sales Reports - Breederplants";
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = {};

    for (let [key, value] of formData.entries()) {
      if (key.startsWith("amount_sold")) {
        if (!data.amount_sold) data.amount_sold = {};
        const id = key.match(/\[(.*?)\]/)[1];
        data.amount_sold[id] = value;
      } else if (key.startsWith("unit_price")) {
        if (!data.unit_price) data.unit_price = {};
        const id = key.match(/\[(.*?)\]/)[1];
        data.unit_price[id] = value;
      } else if (key.startsWith("product_id")) {
        if (!data.product_id) data.product_id = {};
        const id = key.match(/\[(.*?)\]/)[1];
        data.product_id[id] = value;
      } else if (key.startsWith("product_name")) {
        if (!data.product_name) data.product_name = {};
        const id = key.match(/\[(.*?)\]/)[1];
        data.product_name[id] = value;
      } else if (key === "quarter") {
        data.quarter = value;
      } else if (key === "year") {
        data.year = value;
      }
    }

    data.quarters_array = JSON.stringify(currentSalesReport?.quarters_array);

    const res = await submitSalesReport(data);
    if (res.status === 200) {
      navigate("/sales-reports");
    }
  };

  return (
    <div className="bg-gray-50 -mt-12">
      {/* Content */}
      <div className="container mx-auto">
        <div className="-mt-12 z-10 relative">
          <div className="min-h-screen bg-white rounded-t-3xl p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Submit sales report for{" "}
              {currentSalesReport?.quarters_array &&
                currentSalesReport?.quarters_array.map((q, index, array) => (
                  <span key={index}>
                    {q.quarter.charAt(0).toUpperCase() + q.quarter.slice(1)} -{" "}
                    {q.year}
                    {index !== array.length - 1 ? ", " : ""}
                  </span>
                ))}
            </h2>
            <p className="text-sm sm:text-base">
              Please submit your sales for the period from{" "}
              {new Date(currentSalesReport?.start_date).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
              {"  "}
              up to and including{" "}
              {new Date(currentSalesReport?.end_date).toLocaleDateString(
                "en-GB",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>
            <div>
              <form onSubmit={handleSubmit}>
                <input type="hidden" name="quarter" value={quarter} />
                <input type="hidden" name="year" value={year} />
                <div className="mx-auto py-4 mt-5">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left p-2 sm:p-4 text-sm sm:text-sm font-semibold text-gray-600">
                            Product Name
                          </th>
                          <th className="text-left p-2 sm:p-4 text-sm sm:text-sm font-semibold text-gray-600">
                            Unit Price
                          </th>
                          <th className="text-left p-2 sm:p-4 text-sm sm:text-sm font-semibold text-gray-600">
                            Amount Sold
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentSalesReport?.grower_products.map(
                          (productDetail) => (
                            <tr key={productDetail.id} className="border-t">
                              <td className="p-2 sm:p-4 text-gray-800 text-sm sm:text-sm">
                                {productDetail.product.genus}{" "}
                                {productDetail.product.species}
                              </td>
                              <td className="p-2 sm:p-4 text-gray-800 text-sm sm:text-sm">
                                {productDetail.unit_price}
                              </td>
                              <td className="p-2 sm:p-4 text-sm sm:text-sm">
                                <input
                                  type="number"
                                  name={`amount_sold[${productDetail.id}]`}
                                  placeholder="Enter amount"
                                  className="w-full max-w-[200px] px-2 sm:px-3 py-1 sm:py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-sm"
                                />
                                {/* Hidden fields for unit_price and product info */}
                                <input
                                  type="hidden"
                                  name={`unit_price[${productDetail.id}]`}
                                  value={productDetail.unit_price}
                                />
                                <input
                                  type="hidden"
                                  name={`product_id[${productDetail.id}]`}
                                  value={productDetail.product.id}
                                />
                                <input
                                  type="hidden"
                                  name={`product_name[${productDetail.id}]`}
                                  value={`${productDetail.product.genus} ${productDetail.product.species}`}
                                />
                              </td>
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
                      className="w-full text-center align-middle h-12 rounded-full text-sm lg:text-lg bg-primary hover:bg-secondary text-white font-semibold transition-colors flex items-center justify-center">
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      ) : (
                        "Submit Sales Report"
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
