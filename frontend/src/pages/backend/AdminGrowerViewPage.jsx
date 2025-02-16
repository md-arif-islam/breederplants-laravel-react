import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Download, TreePineIcon } from "lucide-react";
import hydrangeaImg from "../../assets/images/hydrangea-paniculata.jpg";
import { useStore } from "../../store/useStore";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminGrowerViewPage() {
  const { currentGrower, isLoading, getGrower, deleteGrower } = useStore();
  const [showPopup, setShowPopup] = useState(false);

  // Fetch id from URL
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    getGrower(id);
  }, [getGrower, id]);

  const handleDelete = async (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    setShowPopup(false);
    const response = await deleteGrower(id);
    if (response.status === 200) {
      navigate(`/admin/growers`);
    }
  };

  const cancelDelete = () => {
    setShowPopup(false);
  };

  if (isLoading) {
    return (
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
        <div className="container mx-auto px-4 py-8"></div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f8f9fa]">
      <div className="container mx-auto px-4 py-8">
        {/* Sample Details */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Grower ID</h3>
                <p className="mt-1">{currentGrower?.username}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Company Name
                </h3>
                <p className="mt-1">{currentGrower?.company_name}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Company Email
                </h3>
                <p className="mt-1">{currentGrower?.company_email}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Contact Person
                </h3>
                <p className="mt-1">{currentGrower?.contact_person}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1">
                  <a href={`tel:${currentGrower?.phone}`}>
                    {currentGrower?.phone}
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Website</h3>
                <p className="mt-1">
                  {currentGrower?.website && (
                    <a
                      href={currentGrower.website}
                      className="text-blue-500 hover:underline">
                      {currentGrower.website}
                    </a>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="grid gap-4 sm:grid-cols-2 mt-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Street</h3>
                  <p className="mt-1">{currentGrower?.street}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">City</h3>
                  <p className="mt-1">{currentGrower?.city}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Postal Code
                  </h3>
                  <p className="mt-1">{currentGrower?.postal_code}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Country</h3>
                  <p className="mt-1">{currentGrower?.country}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="grid gap-4 sm:grid-cols-2 mt-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Sales Reporting Quarter
                  </h3>
                  {currentGrower &&
                    JSON.parse(currentGrower.sales_reporting_quarter).map(
                      (quarter, index) => (
                        <span
                          key={index}
                          className="text-sm bg-primary text-white px-2 py-1 rounded-md font-bold text-[12px] mr-1">
                          {quarter.toUpperCase()}
                        </span>
                      )
                    )}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">
                    Agreement Number
                  </h3>
                  <p className="text-primary font-bold">
                    {currentGrower?.agreement_number}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                        currentGrower?.user?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {currentGrower?.user?.status === "active"
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-8">
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                onClick={() => navigate(`/admin/growers/${id}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
              <button
                onClick={() => navigate(`/admin/growers/${id}/products`)}
                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50">
                <TreePineIcon className="mr-2 h-4 w-4" />
                Grower Products
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p>Are you sure you want to delete this grower?</p>
            <div className="flex gap-2 mt-4">
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                onClick={confirmDelete}>
                Yes
              </button>
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                onClick={cancelDelete}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
