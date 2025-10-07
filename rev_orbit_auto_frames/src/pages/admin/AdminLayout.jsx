import React from 'react';
import Sidebar from '../../components/ui/Sidebar';
import Navbar from '../../components/ui/Navbar';
import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
