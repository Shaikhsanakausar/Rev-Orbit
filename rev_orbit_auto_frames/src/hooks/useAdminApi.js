import { useState, useCallback } from 'react';

const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('sb-access-token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// --- PRODUCTS ---
export function useAdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/products`);
      let data = [];
      try { data = await res.json(); } catch { data = []; }
      if (!res.ok && data?.error) throw new Error(data.error);
      setProducts(Array.isArray(data) ? data : []);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  const addProduct = async (product) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(product),
      });
      let data = {};
      try { data = await res.json(); } catch { data = {}; }
      if (!res.ok) throw new Error(data?.error || 'Failed to add product');
      await fetchProducts();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const updateProduct = async (id, updates) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(updates),
      });
      let data = {};
      try { data = await res.json(); } catch { data = {}; }
      if (!res.ok) throw new Error(data?.error || 'Failed to update product');
      await fetchProducts();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      let data = {};
      try { data = await res.json(); } catch { data = {}; }
      if (!res.ok) throw new Error(data?.error || 'Failed to delete product');
      await fetchProducts();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return { products, loading, error, fetchProducts, addProduct, updateProduct, deleteProduct };
}

// --- ORDERS ---
export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/orders`, { headers: authHeaders() });
      const data = await res.json();
      setOrders(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  const updateOrderStatus = async (id, status) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      await fetchOrders();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return { orders, loading, error, fetchOrders, updateOrderStatus };
}

// --- USERS ---
export function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { headers: authHeaders() });
      const data = await res.json();
      setUsers(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  return { users, loading, error, fetchUsers };
}

// --- INVENTORY ---
export function useAdminInventory() {
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLowStock = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/inventory/low-stock`, { headers: authHeaders() });
      const data = await res.json();
      setLowStock(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  const updateStock = async (id, stock_quantity) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/inventory/${id}/stock`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ stock_quantity }),
      });
      if (!res.ok) throw new Error('Failed to update stock');
      await fetchLowStock();
    } catch (e) { setError(e.message); }
    setLoading(false);
  };

  return { lowStock, loading, error, fetchLowStock, updateStock };
}

// --- ANALYTICS ---
export function useAdminAnalytics() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_BASE}/admin/analytics/summary`, { headers: authHeaders() });
      const data = await res.json();
      setSummary(data);
    } catch (e) { setError(e.message); }
    setLoading(false);
  }, []);

  return { summary, loading, error, fetchSummary };
}
