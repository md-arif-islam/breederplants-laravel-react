import React, { useState } from "react";
import { X } from "lucide-react";

export function ImportGrowerModal({ isOpen, onClose, onImport }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("No file chosen");

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileName(file ? file.name : "No file chosen");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onImport(selectedFile);
    } else {
      alert("Please select a file");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              Import Grower Report (CSV)
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
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="text-gray-500">{fileName}</span>
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
