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
} from "react-icons/fi";
import { MdLaptop } from "react-icons/md";
import toast from "react-hot-toast";

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const menuItems = [
    { path: "/user/dashboard", icon: FiGrid, label: "Dashboard" },
    { path: "/user/orders", icon: FiPackage, label: "My Orders" },
    { path: "/user/wishlist", icon: FiHeart, label: "Wishlist" },
    { path: "/user/profile", icon: FiUser, label: "Profile" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setSidebarOpen(false);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#0f172a] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2">
          <FiMenu size={24} />
        </button>
        <Link to="/user/dashboard" className="flex items-center gap-2">
          <MdLaptop className="text-blue-500" size={24} />
          <span className="font-bold text-lg">LapHub</span>
        </Link>
        <div className="w-8"></div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-[#0f172a] text-gray-300 z-50
          transform transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:flex lg:flex-col
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-3">
            <MdLaptop className="text-blue-500" size={28} />
            <h1 className="text-white font-bold text-xl">LapHub.pk</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-white font-medium">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                isActive(item.path)
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full rounded-lg text-red-400 hover:bg-red-400/10 hover:text-red-500 transition"
          >
            <FiLogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-0 flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white px-4 py-3 flex items-center justify-between shadow-sm border-b sticky top-0 z-30">
          <div className="hidden lg:block w-10"></div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-lg">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search laptops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </form>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {user?.name?.split(" ")[0] || "User"}
                </p>
                <p className="text-xs text-gray-500">My Account</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>

          <div className="lg:hidden w-8"></div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <div className="bg-white rounded-xl shadow-sm min-h-[calc(100vh-120px)] p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
