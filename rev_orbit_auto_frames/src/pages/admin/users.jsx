import React, { useEffect } from 'react';
import { useAdminUsers } from '../../hooks/useAdminApi';

export default function UsersAdmin() {
  const { users, loading, error, fetchUsers } = useAdminUsers();

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 
                    min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-5xl bg-white/70 backdrop-blur-lg 
                      rounded-2xl shadow-2xl border border-blue-200 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 drop-shadow">
          Users Management
        </h1>

        <div className="bg-white/80 rounded-xl shadow-md overflow-hidden border border-gray-200">
          <h2 className="text-xl font-semibold px-6 py-4 text-gray-700 border-b">
            All Users
          </h2>

          {loading && <div className="px-6 py-4 text-gray-600">Loading...</div>}
          {error && <div className="px-6 py-4 text-red-500">{error}</div>}

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white">
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Signup Date</th>
                  <th className="p-3 text-left">User ID</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr
                    key={u.id}
                    className="border-b transition-all duration-700 ease-in-out
                               hover:bg-blue-100 hover:scale-[1.01]"
                  >
                    <td className="p-3 font-medium text-gray-800">{u.email}</td>
                    <td className="p-3 text-gray-600">
                      {u.created_at ? new Date(u.created_at).toLocaleDateString() : '-'}
                    </td>
                    <td className="p-3 text-gray-500">{u.id}</td>
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
