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
  FiSearch,
  FiBell,
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
    <div className="flex min-h-screen bg-gray-100">
      {/* 🔥 SIDEBAR */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#0f172a] text-gray-300">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3">
          <MdLaptop className="text-blue-500" size={28} />
          <h1 className="text-white font-bold text-xl">LapHub</h1>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
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
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-400 hover:text-red-500"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>

      {/* 🔥 MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* 🔥 TOP HEADER */}
        <header className="bg-white px-6 py-4 flex items-center justify-between shadow-sm border-b">
          {/* Search */}
          <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg w-full max-w-md">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none w-full"
            />
          </div>

          {/* Right */}
        </header>

        {/* 🔥 CONTENT */}
        <main className="p-6">
          <div className="bg-white rounded-xl border border-dashed border-gray-300 min-h-[500px] p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
