import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const ProductImageGallery = ({ product }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Fallback: use image_url if mainImage is missing
  const images = [
    product?.mainImage || product?.image_url,
    ...(Array.isArray(product?.galleryImages) ? product.galleryImages : [])
  ];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images?.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images?.length) % images?.length);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative bg-surface rounded-xl overflow-hidden automotive-shadow-lg">
        <div className="aspect-square relative">
          <Image
            src={images?.[selectedImageIndex]}
            alt={`${product?.name} - View ${selectedImageIndex + 1}`}
            className={`w-full h-full object-cover cursor-zoom-in automotive-transition ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center automotive-shadow hover:bg-card automotive-transition"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center automotive-shadow hover:bg-card automotive-transition"
          >
            <Icon name="ChevronRight" size={20} />
          </button>

          {/* 360° Badge */}
          <div className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-medium automotive-shadow">
            <Icon name="RotateCcw" size={16} className="inline mr-1" />
            360° View
          </div>

          {/* Zoom Indicator */}
          <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-muted-foreground">
            <Icon name="ZoomIn" size={16} className="inline mr-1" />
            Click to zoom
          </div>
        </div>
      </div>
      {/* Thumbnail Gallery */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {images?.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 automotive-transition ${
              selectedImageIndex === index
                ? 'border-accent automotive-shadow'
                : 'border-border hover:border-muted-foreground'
            }`}
          >
            <Image
              src={image}
              alt={`${product?.name} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
      {/* Image Counter */}
      <div className="text-center text-sm text-muted-foreground">
        {selectedImageIndex + 1} of {images?.length} images
      </div>
    </div>
  );
};

export default ProductImageGallery;