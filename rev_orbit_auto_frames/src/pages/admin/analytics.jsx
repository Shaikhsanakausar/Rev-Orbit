import React, { useEffect } from 'react';
import { useAdminAnalytics } from '../../hooks/useAdminApi';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function AnalyticsAdmin() {
  const { summary, loading, error, fetchSummary } = useAdminAnalytics();

  useEffect(() => { fetchSummary(); }, [fetchSummary]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 
                    min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-lg rounded-2xl 
                      shadow-xl border border-blue-200 p-8">
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800 drop-shadow">
          Analytics
        </h1>

        <div className="bg-white/90 p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Overview</h2>

          {loading && <div>Loading...</div>}
          {error && <div className="text-red-500">{error}</div>}

          {/* Summary Cards */}
          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-6 rounded-xl shadow-lg">
                <div className="text-sm opacity-90">Total Sales</div>
                <div className="text-2xl font-bold">₹{summary?.totalSales ?? 0}</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 text-white p-6 rounded-xl shadow-lg">
                <div className="text-sm opacity-90">Total Orders</div>
                <div className="text-2xl font-bold">{summary?.totalOrders ?? 0}</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white p-6 rounded-xl shadow-lg">
                <div className="text-sm opacity-90">Top Products</div>
                <ul className="text-base mt-2 space-y-1">
                  {(summary?.mostSold ?? []).map((p, i) => (
                    <li key={p.product_id}>
                      {i + 1}. Product #{p.product_id} ({p.quantity} sold)
                    </li>
                  ))}
                  {(summary?.mostSold?.length ?? 0) === 0 && (
                    <li className="opacity-80">No data</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Sales Chart */}
          <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Sales Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary?.salesChart ?? [{ name: 'Jan', sales: 0 }]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
