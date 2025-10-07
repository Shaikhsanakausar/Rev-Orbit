import React, { useEffect, useState } from 'react';
import { useAdminInventory } from '../../hooks/useAdminApi';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function InventoryAdmin() {
  const { lowStock, loading, error, fetchLowStock, updateStock } = useAdminInventory();
  const [editId, setEditId] = useState(null);
  const [newQty, setNewQty] = useState('');

  useEffect(() => { fetchLowStock(); }, [fetchLowStock]);

  const handleEdit = (p) => {
    setEditId(p.id);
    setNewQty(p.stock_quantity);
  };

  const handleUpdate = async (id) => {
    await updateStock(id, Number(newQty));
    setEditId(null);
  };

  return (
    <div className="bg-background min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-muted/50 rounded-2xl shadow-lg border border-border p-8">
        <h1 className="text-3xl font-bold mb-6 text-primary drop-shadow">Stock & Inventory</h1>
        <div className="bg-card p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Low Stock Products</h2>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-muted">
                  <th className="p-3 text-left">Image</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Stock</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-accent/20 transition">
                    <td className="p-3"><img src={p.image_url} alt={p.name} className="h-10 w-10 object-cover rounded-xl shadow" /></td>
                    <td className="p-3">{p.name}</td>
                    <td className="p-3">
                      {editId === p.id ? (
                        <Input type="number" value={newQty} onChange={e => setNewQty(e.target.value)} className="w-20" />
                      ) : (
                        p.stock_quantity
                      )}
                    </td>
                    <td className="p-3 flex gap-2">
                      {editId === p.id ? (
                        <>
                          <Button size="xs" variant="success" onClick={() => handleUpdate(p.id)} loading={loading}>Save</Button>
                          <Button size="xs" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
                        </>
                      ) : (
                        <Button size="xs" variant="outline" onClick={() => handleEdit(p)}>Edit</Button>
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
