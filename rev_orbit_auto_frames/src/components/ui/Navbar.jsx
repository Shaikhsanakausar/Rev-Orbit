import React from 'react';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';

export default function Navbar() {
  const { user } = useSupabaseAuth();

  const handleLogout = async () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Show user initials as avatar
  const getInitials = (email) => {
    if (!email) return '';
    const [name] = email.split('@');
    return name
      .split(/[._-]/)
      .map((n) => n[0]?.toUpperCase())
      .join('');
  };

  return (
    <header className="flex items-center justify-between bg-white/90 border-b px-8 py-4 shadow-sm">
      <div className="font-headline text-xl font-extrabold text-primary tracking-tight drop-shadow">REV-orbit Admin</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/80 flex items-center justify-center text-white font-bold text-lg shadow">
            {getInitials(user?.email)}
          </div>
          <span className="text-sm text-gray-700 font-medium">{user?.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 text-sm font-semibold shadow transition"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
