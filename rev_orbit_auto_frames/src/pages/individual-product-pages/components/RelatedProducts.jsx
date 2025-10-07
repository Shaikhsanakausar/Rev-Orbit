import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Link } from 'react-router-dom';

const RelatedProducts = ({ products, title = "Related Products" }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-card p-6 rounded-xl automotive-shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline text-2xl font-bold">{title}</h2>
        <Link to="/product-catalog">
          <Button variant="ghost" iconName="ArrowRight" iconPosition="right">
            View All
          </Button>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product) => (
          <div key={product?.id} className="group">
            <div className="bg-surface rounded-lg overflow-hidden automotive-shadow hover:automotive-shadow-lg automotive-transition">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover group-hover:scale-105 automotive-transition"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-1">
                  {product?.isNew && (
                    <span className="bg-success text-success-foreground px-2 py-1 rounded text-xs font-medium">
                      New
                    </span>
                  )}
                  {product?.discount && (
                    <span className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-medium">
                      {product?.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 automotive-transition">
                  <div className="flex flex-col space-y-2">
                    <button className="w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card automotive-transition">
                      <Icon name="Heart" size={16} />
                    </button>
                    <button className="w-8 h-8 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-card automotive-transition">
                      <Icon name="Eye" size={16} />
                    </button>
                  </div>
                </div>

                {/* Quick Add to Cart */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 automotive-transition">
                  <Button
                    variant="default"
                    size="sm"
                    fullWidth
                    iconName="ShoppingCart"
                    iconPosition="left"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Quick Add
                  </Button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="mb-2">
                  <h3 className="font-headline font-semibold text-lg line-clamp-2 group-hover:text-accent automotive-transition">
                    {product?.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {product?.category}
                  </p>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-1 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={12}
                        className={i < Math.floor(product?.rating) ? 'text-warning fill-current' : 'text-muted-foreground'}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product?.reviewCount})
                  </span>
                </div>

                {/* Pricing */}
                <div className="flex items-baseline space-x-2 mb-3">
                  <span className="font-bold text-lg text-primary">
                    {formatPrice(product?.price)}
                  </span>
                  {product?.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product?.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Key Features */}
                <div className="space-y-1">
                  {product?.keyFeatures?.slice(0, 2)?.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-1">
                      <Icon name="Check" size={12} className="text-success" />
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Compatibility */}
                {product?.compatibleCars && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center space-x-1 mb-1">
                      <Icon name="Car" size={12} className="text-accent" />
                      <span className="text-xs font-medium">Perfect for:</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {product?.compatibleCars?.slice(0, 2)?.join(', ')}
                      {product?.compatibleCars?.length > 2 && ` +${product?.compatibleCars?.length - 2} more`}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* View More */}
      <div className="text-center mt-6">
        <Link to="/product-catalog">
          <Button
            variant="outline"
            iconName="Grid3X3"
            iconPosition="left"
          >
            Explore Full Catalog
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default RelatedProducts;