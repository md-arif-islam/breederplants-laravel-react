import React, { useState } from "react";
import { Eye, Pencil, Trash2, Download, Leaf } from "lucide-react";
import { useVarietyReportStore } from "../../store/useVarietyReportStore";
// import hydrangeaImg from "../../assets/images/hydrangea-paniculata.jpg"; // if needed

export function VarietyReportCard({ report, onDelete }) {
  const [showPopup, setShowPopup] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false); // state to track image load
  const { deleteVarietyReport } = useVarietyReportStore();

  const handleDelete = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  const confirmDelete = async () => {
    setShowPopup(false);
    const response = await deleteVarietyReport(report.id);
    if (response.status === 200) {
      onDelete();
    }
  };

  const cancelDelete = () => {
    setShowPopup(false);
  };

  const thumbnailUrl = report?.thumbnail
    ? `${import.meta.env.VITE_API_URL}/${report.thumbnail}`
    : null;

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden group relative px-3">
      <div className="relative h-96 w-full">
        {/* Placeholder Skeleton */}
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <Leaf className="w-8 h-8 text-gray-500 animate-pulse" />
          </div>
        )}
        <img
          src={thumbnailUrl || "/placeholder.svg"}
          alt={report.variety_name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover rounded-lg mt-3 transition-opacity duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Hover Action Icons */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-5 flex gap-2 p-2 border border-white rounded-lg backdrop-blur-md bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={`/admin/variety-reports/${report.id}`}
            className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors">
            <Eye className="w-5 h-5" />
          </a>
          <a
            href={`/admin/variety-reports/${report.id}/edit`}
            className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors">
            <Pencil className="w-5 h-5" />
          </a>
          <button
            onClick={handleDelete}
            className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
          <a
            href={`/admin/variety-reports/${report.id}/export`}
            className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors">
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{report.variety_name}</h3>
      </div>
      <div className="p-4 grid gap-2 text-sm">
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Company</span>
          <span className="justify-self-end">
            {report?.grower?.company_name}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Breeder name</span>
          <span className="justify-self-end">
            {report?.breeder?.company_name}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Date of propagation</span>
          <span className="justify-self-end">{report.date_of_propagation}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Date of potting</span>
          <span className="justify-self-end">{report.date_of_potting}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Amount of plants</span>
          <span className="justify-self-end">{report.amount_of_plants}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Amount of samples</span>
          <span className="justify-self-end">22</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Next Sample Date</span>
          <span className="justify-self-end">
            {JSON.parse(report.samples_schedule)[0]}
          </span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Start Date</span>
          <span className="justify-self-end">{report.start_date}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">End Date</span>
          <span className="justify-self-end">{report.end_date}</span>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-10">
          <div className="bg-white p-4 rounded-md shadow-md">
            <p>Are you sure you want to delete this variety report?</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={confirmDelete}
                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50">
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="inline-flex items-center px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-50">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
