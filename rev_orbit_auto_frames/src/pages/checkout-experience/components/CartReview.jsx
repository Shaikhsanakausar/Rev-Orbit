import React from 'react';
import Image from '../../../components/AppImage';

import Button from '../../../components/ui/Button';

/**
 * @param {Object[]} cartItems
 * @param {(cartRowId: number) => void} onRemoveItem - Remove by cart row id (not product id)
 */
const CartReview = ({ cartItems, onUpdateQuantity, onRemoveItem, onEditCustomization }) => {
  const calculateSubtotal = () => {
    return cartItems?.reduce((total, item) => total + (item?.price * item?.quantity), 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(price);
  };

  return (
    <div className="bg-card rounded-lg automotive-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-headline text-xl font-bold text-primary">Order Review</h2>
        <span className="text-sm text-muted-foreground">{cartItems?.length} items</span>
      </div>
      <div className="space-y-4">
        {cartItems?.map((item) => (
          <div key={item?.id} className="flex gap-4 p-4 border border-border rounded-lg">
            <div className="w-20 h-20 rounded-lg overflow-hidden automotive-shadow">
              <Image
                src={item?.image}
                alt={item?.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <h3 className="font-body font-semibold text-primary mb-1">{item?.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">{item?.description}</p>
              
              {item?.customization && (
                <div className="bg-muted rounded-md p-2 mb-2">
                  <p className="text-xs font-medium text-primary mb-1">Customization:</p>
                  <p className="text-xs text-muted-foreground">{item?.customization}</p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="xs"
                    iconName="Minus"
                    onClick={() => onUpdateQuantity(item?.id, item?.quantity - 1)}
                    disabled={item?.quantity <= 1}
                  />
                  <span className="font-body font-medium px-2">{item?.quantity}</span>
                  <Button
                    variant="outline"
                    size="xs"
                    iconName="Plus"
                    onClick={() => onUpdateQuantity(item?.id, item?.quantity + 1)}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Edit"
                    onClick={() => onEditCustomization(item?.id)}
                    className="text-muted-foreground hover:text-primary"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Trash2"
                    onClick={() => onRemoveItem(item?.id)}
                    className="text-destructive hover:text-destructive/80"
                  />
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="font-body font-bold text-primary">{formatPrice(item?.price * item?.quantity)}</p>
              {item?.quantity > 1 && (
                <p className="text-xs text-muted-foreground">{formatPrice(item?.price)} each</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-4 mt-6">
        <div className="flex justify-between items-center">
          <span className="font-body font-semibold text-primary">Subtotal:</span>
          <span className="font-headline text-xl font-bold text-primary">{formatPrice(calculateSubtotal())}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Shipping and taxes calculated at next step</p>
      </div>
    </div>
  );
};

export default CartReview;