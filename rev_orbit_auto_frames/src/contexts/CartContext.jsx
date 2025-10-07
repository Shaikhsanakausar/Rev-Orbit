import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, session } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAuthConfig = () => {
    if (!session?.access_token) {
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    };
  };

  const fetchCart = async () => {
    const config = getAuthConfig();
    if (!user || !config) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get('/api/cart', config);
      // Normalize: flatten product details, handle missing product
      const normalized = Array.isArray(data)
        ? data.map(item => {
            const product = item.products || {};
            return {
              id: item.id,
              quantity: item.quantity,
              user_id: item.user_id,
              product_id: item.product_id,
              name: product.name || 'Product not available',
              price: product.price ?? 0,
              image: product.image_url || '',
              // add more fields as needed
            };
          })
        : [];
      setCart(normalized);
    } catch (error) {
      console.error('Error fetching cart:', error);
      // If token is expired or invalid, Supabase might return a 401
      // You could add logic here to sign out the user
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, [user, session]);


  // Add to cart (for new product)
  const addToCart = async (productId, quantity = 1) => {
    const config = getAuthConfig();
    if (!user || !config) {
      alert('Please log in to add items to your cart.');
      return;
    }
    try {
      const response = await axios.post('/api/cart', { product_id: productId, quantity }, config);
      console.log('Add to cart response:', response.data);
      await fetchCart();
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add product to cart.');
    }
  };

  // Update quantity for an existing cart row
  const updateQuantity = async (cartRowId, newQuantity) => {
    const config = getAuthConfig();
    if (!user || !config) return { error: { message: 'Not authenticated' } };
    try {
      // PATCH or PUT is more RESTful, but backend expects POST/PUT/DELETE
      const response = await axios.put(`/api/cart/${cartRowId}`, { quantity: newQuantity }, config);
      await fetchCart();
      return { error: null };
    } catch (error) {
      console.error('Error updating quantity:', error);
      return { error: { message: 'Failed to update quantity.' } };
    }
  };

  /**
   * Remove a cart item by its cart row id (not product id!)
   * @param {number} cartRowId - The id field of the cart row
   */
  const removeFromCart = async (cartRowId) => {
    const config = getAuthConfig();
    if (!user || !config) return;
    try {
      await axios.delete(`/api/cart/${cartRowId}`, config);
      await fetchCart(); // Always refresh cart from backend after delete
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const value = {
    cart,
    cartItems: cart, // alias for compatibility
    setCart, // expose setCart for direct state updates
    addToCart,
    updateQuantity,
    removeFromCart,
    loading,
    cartCount: cart ? cart.reduce((acc, item) => acc + item.quantity, 0) : 0,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
