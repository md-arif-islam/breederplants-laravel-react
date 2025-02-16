import React, { useState } from "react";
import { Eye, Pencil, Trash2, Download, Leaf } from "lucide-react";

export function VarietySampleCard({ sample, varietyReportId }) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    if (
      window.confirm("Are you sure you want to delete this variety sample?")
    ) {
      // Delete the variety sample
      console.log(`Deleting variety sample with ID: ${sample.id}`);
    }
  };

  // Build full image URL
  let imagePath = "/placeholder.svg";
  try {
    const storedImages = sample && JSON.parse(sample.images);
    if (storedImages && storedImages[0]) {
      imagePath = `${import.meta.env.VITE_API_URL}/${storedImages[0]}`;
    }
  } catch (error) {
    console.error("Error parsing images: ", error);
  }

  return (
    <div className="bg-white rounded-xl shadow overflow-hidden group relative px-3">
      <div className="relative h-96 w-full">
        {/* Placeholder shown until image loads */}
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <Leaf className="w-8 h-8 text-gray-500 animate-pulse" />
          </div>
        )}
        <img
          src={imagePath}
          alt="Variety Sample"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover rounded-lg mt-3 transition-opacity duration-300 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Hover Action Icons */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-5 flex gap-2 p-2 border border-white rounded-lg backdrop-blur-md bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <a
            href={`/admin/variety-reports/${varietyReportId}/variety-sample/${sample.id}`}
            className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors">
            <Eye className="w-5 h-5" />
          </a>
          <a
            href={`/admin/variety-reports/${varietyReportId}/variety-sample/${sample.id}/edit`}
            className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors">
            <Pencil className="w-5 h-5" />
          </a>
          <form onSubmit={handleDelete} className="inline-block">
            <button
              type="submit"
              className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </form>
          <a
            href={`/admin/variety-reports/${sample.id}/export`}
            className="p-2 bg-white hover:bg-white/50 rounded-md transition-colors">
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>

      <div className="p-4 grid gap-2 text-sm">
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Sample Date</span>
          <span className="justify-self-end">{sample.sample_date}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Leaf Color</span>
          <span className="justify-self-end">{sample.leaf_color}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Amount of Branches</span>
          <span className="justify-self-end">{sample.amount_of_branches}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Flower Buds</span>
          <span className="justify-self-end">{sample.flower_buds}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Branch Color</span>
          <span className="justify-self-end">{sample.branch_color}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Roots</span>
          <span className="justify-self-end">{sample.roots}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Flower Color</span>
          <span className="justify-self-end">{sample.flower_color}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Flower Petals</span>
          <span className="justify-self-end">{sample.flower_petals}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Flowering Time</span>
          <span className="justify-self-end">{sample.flowering_time}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Length of Flowering</span>
          <span className="justify-self-end">{sample.length_of_flowering}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Seeds</span>
          <span className="justify-self-end">{sample.seeds}</span>
        </div>
        <div className="grid grid-cols-2">
          <span className="text-gray-600">Amount of Seeds</span>
          <span className="justify-self-end">{sample.amount_of_seeds}</span>
        </div>
      </div>
    </div>
  );
}
