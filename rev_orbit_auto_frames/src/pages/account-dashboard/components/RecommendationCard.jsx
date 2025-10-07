import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecommendationCard = ({ product }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-4 automotive-shadow hover:automotive-shadow-lg automotive-transition">
      <div className="relative">
        <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-muted">
          <Image
            src={product?.image}
            alt={product?.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Recommendation reason badge */}
        <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 rounded-full text-xs font-medium">
          {product?.recommendationReason}
        </div>

        {/* New/Limited badge */}
        {product?.isNew && (
          <div className="absolute top-2 right-2 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium">
            New
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div>
          <h3 className="font-headline font-semibold text-primary">
            {product?.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product?.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary">
              ₹{product?.price?.toLocaleString('en-IN')}
            </span>
            {product?.originalPrice && product?.originalPrice > product?.price && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{product?.originalPrice?.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <Icon name="Star" size={16} className="text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-primary">{product?.rating}</span>
            <span className="text-sm text-muted-foreground">({product?.reviews})</span>
          </div>
        </div>

        {/* Match percentage */}
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Match Score</span>
            <span className="text-sm font-semibold text-accent">{product?.matchPercentage}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="bg-accent h-2 rounded-full automotive-transition"
              style={{ width: `${product?.matchPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Eye"
            iconPosition="left"
            className="flex-1"
          >
            View Details
          </Button>
          <Button
            variant="default"
            size="sm"
            iconName="ShoppingCart"
            iconPosition="left"
            className="flex-1"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;