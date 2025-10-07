// src/pages/account-dashboard/components/WishlistCard.jsx
import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const WishlistCard = ({ item, onRemove }) => {
  const navigate = useNavigate();

  // ✅ Format price
  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  // ✅ Handle view product
  const handleView = () => {
    if (item?.product_id) {
      navigate(`/products/${item.product_id}`);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center automotive-shadow hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out group">
      
      {/* Product Image + Remove Button */}
      <div className="relative w-full flex justify-center">
        <div className="w-44 h-44 rounded-xl overflow-hidden mb-4 bg-muted flex items-center justify-center group-hover:shadow-md transition-all">
          <Image
            src={item?.image_url || item?.product?.image_url || '/assets/images/no_image.png'}
            alt={item?.name || item?.product?.name || 'Product'}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(item?.product_id || item?.id)}
          className="absolute top-2 right-2 w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow hover:bg-destructive hover:text-destructive-foreground transition-colors"
        >
          <Icon name="X" size={18} />
        </button>
      </div>

      {/* Product Info */}
      <div className="w-full flex-1 flex flex-col items-center space-y-3">
        <h3
          className="font-headline font-semibold text-primary text-center text-base group-hover:text-automotive-orange transition-colors truncate w-full"
          title={item?.name || item?.product?.name}
        >
          {item?.name || item?.product?.name}
        </h3>

        {/* Price */}
        <div className="text-xl font-bold bg-gradient-to-r from-automotive-orange to-red-600 bg-clip-text text-transparent">
          {formatPrice(item?.price || item?.product?.price)}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="Star"
              size={18}
              className={
                i < Math.round(item?.rating || item?.product?.rating || 0)
                  ? 'text-automotive-orange fill-current drop-shadow-sm'
                  : 'text-muted-foreground'
              }
            />
          ))}
          {item?.rating || item?.product?.rating ? (
            <span className="text-sm text-muted-foreground ml-1">
              {(item?.rating || item?.product?.rating).toFixed?.(1) ??
                item?.rating ??
                item?.product?.rating}
            </span>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex w-full gap-3 mt-3">
          <Button
            size="sm"
            iconName="Eye"
            iconPosition="left"
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 transition-all shadow-md"
            onClick={handleView}
          >
            View
          </Button>
          <Button
            size="sm"
            iconName="Trash2"
            iconPosition="left"
            className="flex-1 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:opacity-90 transition-all shadow-md"
            onClick={() => onRemove(item?.product_id || item?.id)}
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
