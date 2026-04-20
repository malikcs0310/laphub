import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiGrid,
  FiPackage,
  FiUser,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { MdLaptop } from "react-icons/md";
import toast from "react-hot-toast";

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const menuItems = [
    { path: "/user/dashboard", icon: FiGrid, label: "Dashboard" },
    { path: "/user/orders", icon: FiPackage, label: "Orders" },
    { path: "/user/wishlist", icon: FiHeart, label: "Wishlist" },
    { path: "/user/profile", icon: FiUser, label: "Profile" },
  ];

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* 🔥 SIDEBAR - Fixed */}
      <aside
        className={`
        fixed top-0 left-0 h-full w-64 bg-[#0f172a] text-gray-300 z-50
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:flex lg:flex-col lg:shrink-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MdLaptop className="text-blue-500" size={28} />
            <h1 className="text-white font-bold text-xl">LapHub</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-white text-sm font-medium">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-400">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive(item.path)
                  ? "bg-gray-800 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-500 w-full"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 🔥 MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* 🔥 HEADER - Fixed - Only User Name */}
        <header className="bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm border-b shrink-0">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <FiMenu size={22} />
          </button>

          {/* Desktop - User Name */}
          <div className="hidden lg:flex items-center gap-3 ml-auto">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500">My Account</p>
            </div>
            <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>

          {/* Mobile - Only Avatar */}
          <div className="lg:hidden">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* 🔥 CONTENT - Scrollable */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-full p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
