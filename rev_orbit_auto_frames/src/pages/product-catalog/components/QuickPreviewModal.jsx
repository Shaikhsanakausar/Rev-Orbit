import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../utils/supabaseClient';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const QuickPreviewModal = ({ product, isOpen, onClose, onAddToCompare }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product?.variants?.[0] || null);
  const navigate = useNavigate();

  // Fallback UI if product is null or missing fields
  if (!isOpen) return null;
  if (!product || !product.id || !product.name) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-card rounded-2xl max-w-md w-full p-8 text-center">
          <h2 className="font-headline font-bold text-xl mb-4 text-primary">Product unavailable</h2>
          <p className="text-muted-foreground mb-4">This product could not be loaded. Please try again later.</p>
          <Button variant="default" onClick={onClose}>Close</Button>
        </div>
      </div>
    );
  }

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  // If image_url is a Supabase Storage path, get public URL
  let mainImage = product?.image_url || product?.image || '/assets/images/no_image.png';
  if (mainImage && typeof mainImage === 'string' && mainImage.startsWith('storage/')) {
    // Example: storage/bucket/path/to/image.jpg
    const parts = mainImage.split('/');
    const bucket = parts[1];
    const path = parts.slice(2).join('/');
    mainImage = supabase.storage.from(bucket).getPublicUrl(path).publicUrl || '/assets/images/no_image.png';
  }
  const images = product?.gallery && product.gallery.length > 0
    ? product.gallery.map(img => {
        if (img && typeof img === 'string' && img.startsWith('storage/')) {
          const parts = img.split('/');
          const bucket = parts[1];
          const path = parts.slice(2).join('/');
          return supabase.storage.from(bucket).getPublicUrl(path).publicUrl || '/assets/images/no_image.png';
        }
        return img || '/assets/images/no_image.png';
      })
    : [mainImage];

  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden automotive-shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="font-headline font-semibold text-xl text-primary">{product?.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">{product?.category}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-primary"
          >
            <Icon name="X" size={24} />
          </Button>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-6 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={images?.[selectedImageIndex] || '/assets/images/no_image.png'}
                alt={product?.name || 'Product'}
                className="w-full h-full object-cover"
                onError={e => { e.target.onerror = null; e.target.src = '/assets/images/no_image.png'; }}
              />
            </div>

            {/* Thumbnail Gallery */}
            {images?.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {images?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`
                      flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 automotive-transition
                      ${selectedImageIndex === index 
                        ? 'border-accent' :'border-border hover:border-muted-foreground'
                      }
                    `}
                  >
                    <Image
                      src={image}
                      alt={`${product?.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Rating & Reviews */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)]?.map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={16}
                    className={`${
                      i < Math.floor(product?.rating)
                        ? 'text-automotive-orange fill-current' :'text-muted-foreground'
                    }`}
                  />
                ))}
                <span className="font-medium text-primary ml-2">{product?.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({product?.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl font-bold text-primary">
                ₹{(selectedVariant?.price || product?.price)?.toLocaleString('en-IN')}
              </span>
              {product?.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product?.originalPrice?.toLocaleString('en-IN')}
                </span>
              )}
              {product?.discount && (
                <span className="px-2 py-1 bg-heritage-green text-white text-sm font-medium rounded-full">
                  {product?.discount}% OFF
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="font-headline font-medium text-sm text-primary mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product?.description}
              </p>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="font-headline font-medium text-sm text-primary mb-3">Specifications</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Dimensions:</span>
                  <span className="text-sm font-medium text-primary">{product?.dimensions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Material:</span>
                  <span className="text-sm font-medium text-primary">{product?.material}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Weight:</span>
                  <span className="text-sm font-medium text-primary">{product?.weight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Customizable:</span>
                  <span className="text-sm font-medium text-primary">
                    {product?.customizable ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Variants */}
            {product?.variants && product?.variants?.length > 0 && (
              <div>
                <h3 className="font-headline font-medium text-sm text-primary mb-3">Variants</h3>
                <div className="grid grid-cols-2 gap-2">
                  {product?.variants?.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(variant)}
                      className={`
                        p-3 rounded-lg border text-left automotive-transition
                        ${selectedVariant?.id === variant?.id
                          ? 'border-accent bg-accent/10' :'border-border hover:border-muted-foreground'
                        }
                      `}
                    >
                      <div className="font-medium text-sm text-primary">{variant?.name}</div>
                      <div className="text-xs text-muted-foreground">{variant?.description}</div>
                      <div className="text-sm font-semibold text-primary mt-1">
                        ₹{variant?.price?.toLocaleString('en-IN')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Car Models */}
            <div>
              <h3 className="font-headline font-medium text-sm text-primary mb-3">Popular for these cars</h3>
              <div className="flex flex-wrap gap-2">
                {product?.popularModels?.map((model, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-muted text-primary text-sm rounded-full"
                  >
                    {model}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
              <Button
                variant="default"
                size="lg"
                iconName="Eye"
                iconPosition="left"
                fullWidth
                className="bg-racing-red hover:bg-racing-red/90 text-white"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                View Details
              </Button>
              
              <div className="flex gap-2">
                <Link to="/customization-studio">
                  <Button
                    variant="outline"
                    size="lg"
                    iconName="Palette"
                    className="hover:bg-accent hover:text-white hover:border-accent"
                  >
                    Customize
                  </Button>
                </Link>
                
                <Button
                  variant="outline"
                  size="lg"
                  iconName="GitCompare"
                  onClick={() => onAddToCompare(product)}
                  className="hover:bg-accent hover:text-white hover:border-accent"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPreviewModal;