import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
} from "lucide-react";
import logo from "../../assets/Vintage Automotive Logo Design.png"; // ✅ apna logo import

const menuItems = [
  { name: "Home", path: "/", icon: Home },
 
  { name: "Products", path: "/admin/products", icon: Package },
  { name: "Users", path: "/admin/users", icon: Users },
  { name: "Orders", path: "/admin/orders", icon: ShoppingCart },
  { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", path: "/admin/settings", icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-600 to-blue-700 text-white flex flex-col shadow-lg">
      {/* ✅ Logo section (not clickable) */}
      <div className="flex flex-col items-center justify-center p-6 border-b border-indigo-400">
        <img
          src={logo}
          alt="Admin Logo"
          className="w-28 h-auto mb-2 drop-shadow-lg"
        />
        <h1 className="font-bold text-xl">Admin Panel</h1>
      </div>

      {/* ✅ Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-500
                ${
                  isActive
                    ? "bg-white text-indigo-600 shadow-md font-semibold"
                    : "hover:bg-indigo-500/50 hover:scale-[1.02]"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
