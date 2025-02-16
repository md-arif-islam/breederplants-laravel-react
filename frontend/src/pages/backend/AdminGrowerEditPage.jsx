import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../store/useStore";

export default function AdminGrowerEditPage() {
  const {
    currentGrower,
    isLoading,
    getGrower,
    updateGrower,
    updateGrowerPassword,
  } = useStore();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    username: "",
    company_name: "",
    contact_person: "",
    street: "",
    city: "",
    postal_code: "",
    country: "",
    phone: "",
    website: "",
    agreement_number: "",
    company_email: "",
    sales_reporting_quarter: [],
    is_active: false,
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    password_confirmation: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getGrower(id);
  }, [getGrower, id]);

  useEffect(() => {
    if (currentGrower) {
      setFormData({
        username: currentGrower.username || "",
        company_name: currentGrower.company_name || "",
        contact_person: currentGrower.contact_person || "",
        street: currentGrower.street || "",
        city: currentGrower.city || "",
        postal_code: currentGrower.postal_code || "",
        country: currentGrower.country || "",
        phone: currentGrower.phone || "",
        website: currentGrower.website || "",
        agreement_number: currentGrower.agreement_number || "",
        company_email: currentGrower.company_email || "",
        sales_reporting_quarter: currentGrower
          ? JSON.parse(currentGrower.sales_reporting_quarter)
          : [],
        is_active: currentGrower.user?.is_active ? true : false,
      });
    }
  }, [currentGrower]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await updateGrower(id, formData);
    if (response.status === 200) {
      navigate(`/admin/growers/${id}`);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const response = updateGrowerPassword(id, passwordData);
    if (response.status === 200) {
      navigate(`/admin/growers/${id}`);
    }
  };

  const generatePassword = () => {
    const password = Math.random().toString(36).slice(-8);
    setPasswordData({ password, password_confirmation: password });
  };

  if (isLoading) {
    return (
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
        <div className="container mx-auto px-4 py-8">Loading...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
      <div className="container mx-auto px-4 py-8">
        {/* Main Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Grower ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Company Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.company_email}
                  onChange={(e) =>
                    setFormData({ ...formData, company_email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_person: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Street <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) =>
                      setFormData({ ...formData, postal_code: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  placeholder="Enter website URL"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Agreement Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={formData.agreement_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      agreement_number: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Sales Reporting Month <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      key={"q1"}
                      className="rounded border-primary"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          sales_reporting_quarter: e.target.checked
                            ? [...prev.sales_reporting_quarter, "q1"]
                            : prev.sales_reporting_quarter.filter(
                                (q) => q !== "q1"
                              ),
                        }));
                      }}
                      checked={formData.sales_reporting_quarter.includes("q1")}
                    />
                    <span className="text-sm">Q1</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      key={"q2"}
                      className="rounded border-primary"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          sales_reporting_quarter: e.target.checked
                            ? [...prev.sales_reporting_quarter, "q2"]
                            : prev.sales_reporting_quarter.filter(
                                (q) => q !== "q2"
                              ),
                        }));
                      }}
                      checked={formData.sales_reporting_quarter.includes("q2")}
                    />
                    <span className="text-sm">Q2</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      key={"q3"}
                      className="rounded border-primary"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          sales_reporting_quarter: e.target.checked
                            ? [...prev.sales_reporting_quarter, "q3"]
                            : prev.sales_reporting_quarter.filter(
                                (q) => q !== "q3"
                              ),
                        }));
                      }}
                      checked={formData.sales_reporting_quarter.includes("q3")}
                    />
                    <span className="text-sm">Q3</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      key={"q4"}
                      className="rounded border-primary"
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          sales_reporting_quarter: e.target.checked
                            ? [...prev.sales_reporting_quarter, "q4"]
                            : prev.sales_reporting_quarter.filter(
                                (q) => q !== "q4"
                              ),
                        }));
                      }}
                      checked={formData.sales_reporting_quarter.includes("q4")}
                    />
                    <span className="text-sm">Q4</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.is_active}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      is_active: e.target.value === "true" ? true : false,
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md">
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Update Grower
            </button>
          </form>
        </div>

        {/* Password Change Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.password}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      password: e.target.value,
                    })
                  }
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-md"
                />
                <button
                  type="button"
                  onClick={generatePassword}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Generate
                </button>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
                  Show
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordData.password_confirmation}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    password_confirmation: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
              Update Password
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
