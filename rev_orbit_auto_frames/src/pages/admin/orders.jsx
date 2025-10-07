import React, { useEffect, useState } from 'react';
import { useAdminOrders } from '../../hooks/useAdminApi';
import Button from '../../components/ui/Button';

const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled'];

export default function OrdersAdmin() {
  const { orders, loading, error, fetchOrders, updateOrderStatus } = useAdminOrders();
  const [editId, setEditId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleEdit = (order) => {
    setEditId(order.id);
    setNewStatus(order.status);
  };

  const handleUpdate = async (id) => {
    await updateOrderStatus(id, newStatus);
    setEditId(null);
  };

  return (
    <div className="bg-background min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-muted/50 rounded-2xl shadow-lg border border-border p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary drop-shadow">Order Management</h1>
        <div className="bg-card p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-foreground">All Orders</h2>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left">Order ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Items</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Payment</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b hover:bg-accent/20 transition">
                    <td className="p-3">{o.id}</td>
                    <td className="p-3">{o.customer_name || o.user_id}</td>
                    <td className="p-3">{Array.isArray(o.items) ? o.items.map(i => i.name).join(', ') : ''}</td>
                    <td className="p-3">₹{o.total_price}</td>
                    <td className="p-3">{o.payment_status || '-'}</td>
                    <td className="p-3">
                      {editId === o.id ? (
                        <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="border rounded px-2 py-1">
                          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      ) : (
                        <span className="capitalize px-2 py-1 rounded bg-gray-100">{o.status}</span>
                      )}
                    </td>
                    <td className="p-3 flex gap-2">
                      {editId === o.id ? (
                        <>
                          <Button size="xs" variant="success" onClick={() => handleUpdate(o.id)} loading={loading}>Save</Button>
                          <Button size="xs" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <Button size="xs" variant="outline" onClick={() => handleEdit(o)}>Edit</Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
