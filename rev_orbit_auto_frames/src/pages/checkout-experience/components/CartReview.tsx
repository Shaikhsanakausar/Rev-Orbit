// @ts-nocheck

import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../contexts/AuthContext';
import { useCart } from '../../../contexts/CartContext';
import { supabase } from '../../../utils/supabaseClient';

type CartItem = {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  user_id: string;
};

type CartReviewProps = {
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onEditCustomization: (id: number) => void;
};

const CartReview: React.FC<CartReviewProps> = ({ onUpdateQuantity, onEditCustomization }) => {
  const { user } = useAuth();
  const { cartItems, setCart } = useCart();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loadingQtyId, setLoadingQtyId] = useState<number | null>(null);

  const handleDelete = async (cartItem: CartItem) => {
    setDeletingId(cartItem.id);
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('id', cartItem.id)
      .eq('user_id', user.id);
    if (!error) {
      setCart((prev) => prev.filter(item => item.id !== cartItem.id));
      alert('Item removed from cart');
    } else {
      alert(error.message);
    }
    setDeletingId(null);
  };

  // Unified quantity change handler using context setCart
  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoadingQtyId(cartItemId);
    let oldQuantity = 1;
    setCart(prev => {
      const found = prev.find(item => item.id === cartItemId);
      oldQuantity = found ? found.quantity : 1;
      return prev.map(item =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      );
    });
    const { error } = await supabase
      .from('cart')
      .update({ quantity: newQuantity })
      .eq('id', cartItemId)
      .eq('user_id', user.id);
    if (error) {
      setCart(prev =>
        prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: oldQuantity } : item
        )
      );
      alert('Failed to update quantity');
    }
    setLoadingQtyId(null);
  };

  const calculateSubtotal = () => {
    return cartItems?.reduce((total, item) => total + (item?.price * item?.quantity), 0);
  };

  const formatPrice = (price: number) => {
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
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted text-xs text-muted-foreground">No Image</div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-body font-semibold text-primary mb-1">{item?.name || 'Product not available'}</h3>
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
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || loadingQtyId === item.id}
                  />
                  <span className="font-body font-medium px-2">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="xs"
                    iconName="Plus"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    disabled={loadingQtyId === item.id}
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
                    onClick={() => handleDelete(item)}
                    className="text-destructive hover:text-destructive/80"
                    disabled={deletingId === item.id}
                  >
                    {deletingId === item.id ? 'Removing...' : 'Delete'}
                  </Button>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-body font-bold text-primary">{formatPrice((item.price ?? 0) * item.quantity)}</p>
              {item.quantity > 1 && (
                <p className="text-xs text-muted-foreground">{formatPrice(item.price ?? 0)} each</p>
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
