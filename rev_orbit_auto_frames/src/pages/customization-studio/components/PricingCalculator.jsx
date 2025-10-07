import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PricingCalculator = ({ 
  frameStyle, 
  material, 
  personalization, 
  features, 
  onSaveDesign, 
  onShareDesign, 
  onProceedToCheckout 
}) => {
  const calculatePrice = () => {
    let total = 0;
    
    // Base frame price
    if (frameStyle) {
      total += frameStyle?.price;
    }
    
    // Material price
    if (material) {
      total += material?.price;
    }
    
    // Personalization price
    if (personalization?.text) {
      const stylePrice = {
        'laser': 800,
        'embossed': 1200,
        'etched': 1000,
        'vinyl': 400
      };
      total += stylePrice?.[personalization?.style] || 0;
    }
    
    // Advanced features
    if (features) {
      // Lighting
      if (features?.lighting && features?.lighting !== 'none') {
        const lightingPrices = {
          'warm-led': 1500,
          'cool-led': 1500,
          'rgb-led': 2500,
          'spotlight': 2000
        };
        total += lightingPrices?.[features?.lighting] || 0;
      }
      
      // Mounting
      if (features?.mounting) {
        const mountingPrices = {
          'wall-standard': 0,
          'wall-floating': 800,
          'easel-desktop': 1200,
          'easel-floor': 2500,
          'magnetic': 1500
        };
        total += mountingPrices?.[features?.mounting] || 0;
      }
      
      // Protection features
      if (features?.protections) {
        const protectionPrices = {
          'uv-protection': 1000,
          'anti-glare': 800,
          'moisture-seal': 600,
          'scratch-resistant': 1200
        };
        features?.protections?.forEach(protection => {
          total += protectionPrices?.[protection] || 0;
        });
      }
    }
    
    return total;
  };

  const getShippingCost = () => {
    const basePrice = calculatePrice();
    if (basePrice > 5000) return 0; // Free shipping over ₹5000
    return 299;
  };

  const getTaxAmount = () => {
    const subtotal = calculatePrice() + getShippingCost();
    return Math.round(subtotal * 0.18); // 18% GST
  };

  const getFinalTotal = () => {
    return calculatePrice() + getShippingCost() + getTaxAmount();
  };

  const getDeliveryEstimate = () => {
    let days = 7; // Base delivery time
    
    if (personalization?.text) days += 3;
    if (features?.lighting && features?.lighting !== 'none') days += 2;
    if (material?.id === 'titanium' || material?.id === 'hybrid') days += 5;
    
    return `${days}-${days + 3} business days`;
  };

  const priceBreakdown = [
    {
      label: frameStyle?.name || 'Frame Style',
      amount: frameStyle?.price || 0,
      included: true
    },
    {
      label: material?.name || 'Material',
      amount: material?.price || 0,
      included: !!material
    },
    {
      label: 'Personalization',
      amount: personalization?.text ? 800 : 0,
      included: !!personalization?.text
    },
    {
      label: 'Advanced Features',
      amount: (() => {
        let featureTotal = 0;
        if (features?.lighting && features?.lighting !== 'none') {
          const prices = { 'warm-led': 1500, 'cool-led': 1500, 'rgb-led': 2500, 'spotlight': 2000 };
          featureTotal += prices?.[features?.lighting] || 0;
        }
        if (features?.mounting && features?.mounting !== 'wall-standard') {
          const prices = { 'wall-floating': 800, 'easel-desktop': 1200, 'easel-floor': 2500, 'magnetic': 1500 };
          featureTotal += prices?.[features?.mounting] || 0;
        }
        if (features?.protections) {
          const prices = { 'uv-protection': 1000, 'anti-glare': 800, 'moisture-seal': 600, 'scratch-resistant': 1200 };
          features?.protections?.forEach(p => featureTotal += prices?.[p] || 0);
        }
        return featureTotal;
      })(),
      included: features && (features?.lighting !== 'none' || features?.mounting !== 'wall-standard' || features?.protections?.length > 0)
    }
  ];

  return (
    <div className="bg-card rounded-xl border border-border automotive-shadow-lg sticky top-24">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-headline text-2xl font-bold text-primary mb-2">Your Design</h2>
          <p className="text-muted-foreground">Pricing & Summary</p>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-4 mb-6">
          <h3 className="font-headline text-lg font-semibold text-primary">Price Breakdown</h3>
          
          {priceBreakdown?.map((item, index) => (
            item?.included && (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                <span className="text-sm text-muted-foreground">{item?.label}</span>
                <span className="text-sm font-medium text-primary">
                  {item?.amount > 0 ? `₹${item?.amount?.toLocaleString('en-IN')}` : 'Included'}
                </span>
              </div>
            )
          ))}
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Subtotal</span>
            <span className="text-sm font-medium text-primary">₹{calculatePrice()?.toLocaleString('en-IN')}</span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">
              Shipping {getShippingCost() === 0 && '(Free)'}
            </span>
            <span className="text-sm font-medium text-primary">
              {getShippingCost() === 0 ? 'Free' : `₹${getShippingCost()?.toLocaleString('en-IN')}`}
            </span>
          </div>
          
          <div className="flex items-center justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">GST (18%)</span>
            <span className="text-sm font-medium text-primary">₹{getTaxAmount()?.toLocaleString('en-IN')}</span>
          </div>
          
          <div className="flex items-center justify-between py-3 bg-muted rounded-lg px-4">
            <span className="font-headline text-lg font-bold text-primary">Total</span>
            <span className="font-headline text-xl font-bold text-accent">₹{getFinalTotal()?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Icon name="Truck" size={20} className="text-accent" />
            <div>
              <p className="font-headline text-sm font-semibold text-primary">Estimated Delivery</p>
              <p className="text-xs text-muted-foreground">{getDeliveryEstimate()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            variant="default"
            size="lg"
            fullWidth
            iconName="ShoppingCart"
            iconPosition="left"
            onClick={onProceedToCheckout}
            className="bg-racing-red hover:bg-racing-red/90 text-white"
          >
            Proceed to Checkout
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              iconName="Save"
              iconPosition="left"
              onClick={onSaveDesign}
            >
              Save Design
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              iconName="Share"
              iconPosition="left"
              onClick={onShareDesign}
            >
              Share Design
            </Button>
          </div>
        </div>

        {/* Guarantee */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center space-x-2 text-center">
            <Icon name="Shield" size={16} className="text-heritage-green" />
            <p className="text-xs text-muted-foreground">
              30-day satisfaction guarantee & lifetime craftsmanship warranty
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingCalculator;