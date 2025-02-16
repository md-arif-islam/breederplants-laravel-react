import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useVarietyReportStore } from "../../store/useVarietyReportStore";
import { useNavigate } from "react-router-dom";

export default function AdminVarietyReportCreatePage() {
  const {
    isLoading,
    createVarietyReport,
    growers,
    breeders,
    getCreateVarietyReport,
  } = useVarietyReportStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    variety_name: "",
    thumbnail: "",
    grower_id: "",
    breeder_id: "",
    date_of_propagation: "",
    date_of_potting: "",
    amount_of_plants: "",
    pot_size: "",
    pot_trial: "0",
    open_field_trial: "0",
    status: "1",
    samples_schedule: [""],
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    getCreateVarietyReport();
  }, [getCreateVarietyReport]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await createVarietyReport(formData);

    if (response.status === 200) {
      navigate("/admin/variety-reports");
    }
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Variety Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.variety_name}
                    onChange={(e) =>
                      setFormData({ ...formData, variety_name: e.target.value })
                    }
                    placeholder="Enter variety name"
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thumbnail
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <label className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100">
                      Choose File
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData({
                                ...formData,
                                thumbnail: reader.result,
                              });
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <span className="text-gray-500">
                      {formData.thumbnail ? (
                        <img
                          src={formData.thumbnail}
                          alt="Thumbnail Preview"
                          className="h-28 w-28 object-cover rounded-md"
                        />
                      ) : (
                        "No file chosen"
                      )}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Grower Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.grower_id}
                    onChange={(e) =>
                      setFormData({ ...formData, grower_id: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="">Select Grower</option>
                    {growers?.map((grower) => (
                      <option key={grower.id} value={grower.id}>
                        {grower.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Breeder Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.breeder_id}
                    onChange={(e) =>
                      setFormData({ ...formData, breeder_id: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="">Select Breeder</option>
                    {breeders?.map((breeder) => (
                      <option key={breeder.id} value={breeder.id}>
                        {breeder.company_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Propagation
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_propagation}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_propagation: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Potting
                  </label>
                  <input
                    type="date"
                    value={formData.date_of_potting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        date_of_potting: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount of Plants <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount_of_plants}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amount_of_plants: e.target.value,
                      })
                    }
                    placeholder="Enter amount of plants"
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pot Size
                  </label>
                  <input
                    type="text"
                    value={formData.pot_size}
                    onChange={(e) =>
                      setFormData({ ...formData, pot_size: e.target.value })
                    }
                    placeholder="Enter pot size"
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pot Trial
                  </label>
                  <select
                    value={formData.pot_trial}
                    onChange={(e) =>
                      setFormData({ ...formData, pot_trial: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Open Field Trial <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.open_field_trial}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        open_field_trial: e.target.value,
                      })
                    }
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="1">Yes</option>
                    <option value="0">No</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500">
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Sample Schedule Dates{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="space-y-2">
                    {formData.samples_schedule.map((date, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => {
                            const newDates = [...formData.samples_schedule];
                            newDates[index] = e.target.value;
                            setFormData({
                              ...formData,
                              samples_schedule: newDates,
                            });
                          }}
                          className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                        />
                        {formData.samples_schedule.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newDates = formData.samples_schedule.filter(
                                (_, i) => i !== index
                              );
                              setFormData({
                                ...formData,
                                samples_schedule: newDates,
                              });
                            }}
                            className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        const newDates = [...formData.samples_schedule, ""];
                        setFormData({
                          ...formData,
                          samples_schedule: newDates,
                        });
                      }}
                      className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                      Add Date
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="mt-1 w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded h-10 bg-primary hover:bg-green-700 text-white transition-colors flex items-center justify-center">
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  </>
                ) : (
                  "Create Variety Report"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
