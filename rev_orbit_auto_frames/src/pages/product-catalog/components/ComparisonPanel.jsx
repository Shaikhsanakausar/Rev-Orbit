import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ComparisonPanel = ({ products, onRemoveProduct, onClearAll, isOpen, onToggle }) => {
  if (products?.length === 0) return null;

  return (
    <>
      {/* Floating Comparison Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          variant="default"
          size="lg"
          iconName="GitCompare"
          iconPosition="left"
          onClick={onToggle}
          className="bg-racing-red hover:bg-racing-red/90 text-white automotive-shadow-lg"
        >
          Compare ({products?.length})
        </Button>
      </div>
      {/* Comparison Panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onToggle}
          />

          {/* Panel */}
          <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 max-h-[80vh] overflow-hidden automotive-shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center space-x-3">
                <Icon name="GitCompare" size={20} className="text-accent" />
                <h3 className="font-headline font-semibold text-lg text-primary">
                  Compare Products ({products?.length}/3)
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="text-muted-foreground hover:text-primary"
                >
                  Clear All
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggle}
                  className="text-muted-foreground hover:text-primary"
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
            </div>

            {/* Comparison Content */}
            <div className="p-4 overflow-x-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-w-[900px]">
                {products?.map((product) => (
                  <div key={product?.id} className="bg-muted rounded-xl p-4 min-w-[300px] relative">
                    {/* Remove Button */}
                    <button
                      onClick={() => onRemoveProduct(product?.id)}
                      className="absolute top-2 right-2 w-6 h-6 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/80 automotive-transition"
                    >
                      <Icon name="X" size={12} />
                    </button>

                    {/* Product Image */}
                    <div className="aspect-[4/3] rounded-lg overflow-hidden mb-3">
                      <Image
                        src={product?.image_url || product?.image || '/assets/images/no_image.png'}
                        alt={product?.name}
                        className="w-full h-full object-cover"
                        onError={e => {
                          e.target.onerror = null;
                          e.target.src = '/assets/images/no_image.png';
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-headline font-semibold text-base text-primary line-clamp-2">
                          {product?.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{product?.category}</p>
                      </div>

                      {/* Price */}
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-bold text-primary">
                          ₹{product?.price?.toLocaleString('en-IN')}
                        </span>
                        {product?.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ₹{product?.originalPrice?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)]?.map((_, i) => (
                            <Icon
                              key={i}
                              name="Star"
                              size={14}
                              className={`${
                                i < Math.floor(product?.rating)
                                  ? 'text-automotive-orange fill-current' :'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-primary">{product?.rating}</span>
                        <span className="text-xs text-muted-foreground">({product?.reviews})</span>
                      </div>

                      {/* Specifications */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Dimensions:</span>
                          <span className="text-primary font-medium">{product?.dimensions}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Material:</span>
                          <span className="text-primary font-medium">{product?.material}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Weight:</span>
                          <span className="text-primary font-medium">{product?.weight}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Customizable:</span>
                          <span className="text-primary font-medium">
                            {product?.customizable ? (
                              <Icon name="Check" size={16} className="text-heritage-green" />
                            ) : (
                              <Icon name="X" size={16} className="text-destructive" />
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Popular Models */}
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Popular for:</p>
                        <div className="flex flex-wrap gap-1">
                          {product?.popularModels?.slice(0, 2)?.map((model, index) => (
                            <span
                              key={index}
                              className="text-xs bg-card text-primary px-2 py-1 rounded-full"
                            >
                              {model}
                            </span>
                          ))}
                          {product?.popularModels?.length > 2 && (
                            <span className="text-xs text-muted-foreground px-2 py-1">
                              +{product?.popularModels?.length - 2}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Link to="/individual-product-pages" className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            className="hover:bg-accent hover:text-white hover:border-accent"
                          >
                            View Details
                          </Button>
                        </Link>
                        <Link to="/customization-studio">
                          <Button
                            variant="default"
                            size="sm"
                            iconName="Palette"
                            className="bg-racing-red hover:bg-racing-red/90 text-white"
                          >
                            Customize
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add More Placeholder */}
                {products?.length < 3 && (
                  <div className="bg-muted/50 rounded-xl p-4 min-w-[300px] border-2 border-dashed border-border flex flex-col items-center justify-center text-center">
                    <Icon name="Plus" size={32} className="text-muted-foreground mb-3" />
                    <h4 className="font-headline font-medium text-primary mb-2">Add Another Product</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Compare up to 3 products to find the perfect frame for your car
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onToggle}
                      className="hover:bg-accent hover:text-white hover:border-accent"
                    >
                      Browse Products
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ComparisonPanel;