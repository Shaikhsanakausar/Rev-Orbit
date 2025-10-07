import React from "react";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";

const CompatibilitySection = () => {
  return (
    <div className="compatibility-section">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Icon name="car" className="text-red-500" /> Perfect For These Frames
      </h2>
      <p className="text-gray-600 mb-6">
        This frame style works exceptionally well with these vehicle types. See
        real customer examples below.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Lamborghini */}
        <div className="card shadow-md rounded-lg overflow-hidden">
          <Image src="/assets/lamborghini.jpg" alt="Lamborghini" />
          <div className="p-4">
            <h3 className="font-semibold">Luxury Sedans</h3>
            <p className="text-gray-500">
              Perfect for BMW, Mercedes, Audi keys and badges
            </p>
            <p className="mt-2 text-sm">
              <strong>Compatibility Score:</strong> ⭐⭐⭐⭐⭐
            </p>
          </div>
        </div>

        {/* Bugatti */}
        <div className="card shadow-md rounded-lg overflow-hidden">
          <Image src="/assets/bugatti.jpg" alt="Bugatti" />
          <div className="p-4">
            <h3 className="font-semibold">Sports Cars</h3>
            <p className="text-gray-500">
              Ideal for Porsche, Ferrari, Lamborghini memorabilia
            </p>
            <p className="mt-2 text-sm">
              <strong>Compatibility Score:</strong> ⭐⭐⭐⭐⭐
            </p>
          </div>
        </div>

        {/* Aston */}
        <div className="card shadow-md rounded-lg overflow-hidden">
          <Image src="/assets/aston.jpg" alt="Aston" />
          <div className="p-4">
            <h3 className="font-semibold">Classic Cars</h3>
            <p className="text-gray-500">
              Showcase vintage car keys and classic badges
            </p>
            <p className="mt-2 text-sm">
              <strong>Compatibility Score:</strong> ⭐⭐⭐⭐
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompatibilitySection;
