import React, { useState } from "react";
import { X } from "lucide-react";

export function ImportReportModal({ isOpen, onClose, onImport }) {
  const [selectedFile, setSelectedFile] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      await onImport(formData); // Pass the formData to the onImport function
      onClose(); // Close the modal after successful import
    } catch (error) {
      console.error("Import failed", error);
      alert("Import failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Import Variety Report (.xlsx)
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <label className="inline-block px-4 py-2 border border-gray-300 rounded cursor-pointer hover:bg-gray-50">
                  Choose File
                  <input
                    type="file"
                    accept=".xlsx"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="text-gray-500">
                  {selectedFile ? selectedFile.name : "No file chosen"}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Import
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
