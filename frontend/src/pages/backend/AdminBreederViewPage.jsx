import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Download, TreePineIcon } from "lucide-react";
import hydrangeaImg from "../../assets/images/hydrangea-paniculata.jpg";
import { useStore } from "../../store/useStore";
import { useNavigate, useParams } from "react-router-dom";

export default function AdminBreederViewPage() {
  const { currentBreeder, isLoading, getBreeder, deleteBreeder } = useStore();
  const [showPopup, setShowPopup] = useState(false);

  // Fetch id from URL
  const { id } = useParams();

  const navigate = useNavigate();

  useEffect(() => {
    getBreeder(id);
  }, [getBreeder, id]);

  const handleDelete = async (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    setShowPopup(false);
    const response = await deleteBreeder(id);
    if (response.status === 200) {
      navigate(`/admin/breeders`);
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
                <h3 className="text-sm font-medium text-gray-500">
                  Breeder ID
                </h3>
                <p className="mt-1">{currentBreeder?.username}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Company Name
                </h3>
                <p className="mt-1">{currentBreeder?.company_name}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Company Email
                </h3>
                <p className="mt-1">{currentBreeder?.company_email}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">
                  Contact Person
                </h3>
                <p className="mt-1">{currentBreeder?.contact_person}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                <p className="mt-1">
                  <a href={`tel:${currentBreeder?.phone}`}>
                    {currentBreeder?.phone}
                  </a>
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-500">Website</h3>
                <p className="mt-1">
                  {currentBreeder?.website && (
                    <a
                      href={currentBreeder.website}
                      className="text-blue-500 hover:underline">
                      {currentBreeder.website}
                    </a>
                  )}
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-4">
              <div className="grid gap-4 sm:grid-cols-2 mt-2">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Street</h3>
                  <p className="mt-1">{currentBreeder?.street}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">City</h3>
                  <p className="mt-1">{currentBreeder?.city}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Postal Code
                  </h3>
                  <p className="mt-1">{currentBreeder?.postal_code}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Country</h3>
                  <p className="mt-1">{currentBreeder?.country}</p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                        currentBreeder?.user?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                      {currentBreeder?.user?.status === "active"
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
                onClick={() => navigate(`/admin/breeders/${id}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </button>
              <button
                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50"
                onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p>Are you sure you want to delete this breeder?</p>
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
