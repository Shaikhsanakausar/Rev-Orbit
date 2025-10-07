// src/pages/account-dashboard/components/AccountOrders.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import OrderCard from './OrderCard';

const AccountOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch normal orders
        const { data: normalOrders, error: normalError } = await supabase
          .from('orders')
          .select('*, order_items(*, products(name, price, image_url))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        // Fetch custom orders
        const { data: customOrders, error: customError } = await supabase
          .from('custom_orders')
          .select('*, order_items(*, products(name, price, image_url))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (normalError || customError) {
          console.error(normalError || customError);
          setOrders([]);
        } else {
          // Combine orders
          const combinedOrders = [
            ...normalOrders.map(o => ({ ...o, type: 'normal' })),
            ...customOrders.map(o => ({ ...o, type: 'custom' })),
          ];

          // Sort by newest first
          combinedOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          setOrders(combinedOrders);
        }
      } catch (err) {
        console.error(err);
        setOrders([]);
      }
      setLoading(false);
    };

    if (user?.id) fetchOrders();
  }, [user]);

  if (loading) return <div>Loading your orders...</div>;
  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Orders</h2>
      <div className="grid grid-cols-1 gap-6">
        {orders.map(order => {
          // Show first product as preview
          const firstItem = order.order_items?.[0]?.products;
          return (
            <OrderCard
              key={order.id}
              order={{
                orderNumber: order.order_number,
                orderDate: new Date(order.created_at).toLocaleDateString('en-IN'),
                status: order.status,
                amount: order.total_amount,
                productImage: firstItem?.image_url,
                productName: firstItem?.name,
                customization: order.order_items?.[0]?.customization,
                productionPhotos: order.productionPhotos || [],
                trackingNumber: order.tracking_number,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default AccountOrders;
