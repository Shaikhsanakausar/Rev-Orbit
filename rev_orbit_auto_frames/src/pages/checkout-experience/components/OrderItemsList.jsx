import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import Image from '../../../components/AppImage';

const OrderItemsList = ({ order_id }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderItems = async () => {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          created_at,
          products (
            name,
            price,
            image_url
          )
        `)
        .eq('order_id', order_id);

      if (error) {
        console.error('Error fetching order items:', error);
        setItems([]);
      } else {
        // Supabase returns related tables as arrays, so pick the first product
        const formattedItems = (data || []).map(item => ({
          ...item,
          product: item.products?.[0] || {},
        }));
        setItems(formattedItems);
      }
      setLoading(false);
    };

    if (order_id) fetchOrderItems();
  }, [order_id]);

  if (loading) return <div>Loading...</div>;
  if (!items.length) return <div>No items found for this order.</div>;

  return (
    <div>
      <h3 className="font-bold text-lg mb-4">Order Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map(item => (
          <div key={item.id} className="bg-card border rounded-lg p-4 flex items-center gap-4">
            <Image
              src={item.product?.image_url || '/assets/images/no_image.png'}
              alt={item.product?.name || 'Product Image'}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <div className="font-bold">{item.product?.name || 'Unknown Product'}</div>
              <div>Quantity: {item.quantity}</div>
              <div>Price: ₹{item.product?.price || 0}</div>
              <div className="text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItemsList;
