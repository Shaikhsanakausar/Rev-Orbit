import React from 'react';
import Icon from '../../../components/AppIcon';

const OrderSummary = ({ 
  subtotal, 
  shippingCost, 
  taxes, 
  discount, 
  total,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  promoApplied 
}) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-card rounded-lg automotive-shadow p-6 sticky top-24">
      <h2 className="font-headline text-xl font-bold text-primary mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-body text-muted-foreground">Subtotal</span>
          <span className="font-body font-medium text-primary">{formatPrice(subtotal)}</span>
        </div>

        {shippingCost > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-body text-muted-foreground">Shipping</span>
            <span className="font-body font-medium text-primary">{formatPrice(shippingCost)}</span>
          </div>
        )}

        {shippingCost === 0 && (
          <div className="flex justify-between items-center">
            <span className="font-body text-muted-foreground">Shipping</span>
            <span className="font-body font-medium text-accent">Free</span>
          </div>
        )}


        <div className="flex justify-between items-center">
          <span className="font-body text-muted-foreground">Taxes (GST)</span>
          <span className="font-body font-medium text-primary">{formatPrice(taxes)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center">
            <span className="font-body text-muted-foreground">Discount</span>
            <span className="font-body font-medium text-accent">-{formatPrice(discount)}</span>
          </div>
        )}
      </div>
      {/* Promo Code Section */}
      <div className="border-t border-border pt-4 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e?.target?.value)}
            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          />
          <button
            onClick={onApplyPromo}
            disabled={!promoCode?.trim() || promoApplied}
            className="px-4 py-2 bg-accent text-accent-foreground rounded-lg text-sm font-medium hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed automotive-transition"
          >
            Apply
          </button>
        </div>
        
        {promoApplied && (
          <div className="flex items-center gap-2 mt-2 text-sm text-accent">
            <Icon name="CheckCircle" size={16} />
            <span>Promo code applied successfully!</span>
          </div>
        )}
      </div>
      <div className="border-t border-border pt-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="font-headline text-lg font-bold text-primary">Total</span>
          <span className="font-headline text-xl font-bold text-primary">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Inclusive of all taxes</p>
      </div>
      {/* Security Badges */}
      <div className="border-t border-border pt-4">
        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Icon name="Shield" size={14} />
            <span>Secure</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="Lock" size={14} />
            <span>Encrypted</span>
          </div>
          <div className="flex items-center gap-1">
            <Icon name="CheckCircle" size={14} />
            <span>Verified</span>
          </div>
        </div>
      </div>
      {/* Money Back Guarantee */}
      <div className="bg-muted rounded-lg p-4 mt-4">
        <div className="flex items-start gap-3">
          <Icon name="RotateCcw" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-body font-medium text-primary mb-1">30-Day Return Policy</h4>
            <p className="text-sm text-muted-foreground">
              Not satisfied? Return your order within 30 days for a full refund.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;