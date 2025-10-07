import React from "react";

export default function BannerUpload({ banners, onUpload, onDelete }) {
  return (
    <div className="mb-8">
      <label className="block font-semibold mb-2">Site Banners:</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={e => onUpload(e.target.files)}
        className="mb-2"
      />
      <div className="flex flex-wrap gap-4 mt-2">
        {banners.map((banner, idx) => (
          <div key={banner.id || idx} className="relative">
            <img src={banner.url} alt="Banner" className="h-24 rounded shadow" />
            <button
              type="button"
              onClick={() => onDelete(banner)}
              className="absolute top-1 right-1 bg-red-600 text-white rounded-full px-2 py-1 text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
