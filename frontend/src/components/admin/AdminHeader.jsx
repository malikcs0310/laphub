import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiBell, FiMenu } from "react-icons/fi";

const AdminHeader = ({ setMobileSidebarOpen }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/admin/view-products?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left - Mobile Menu Button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <FiMenu size={22} />
        </button>

        {/* Logo (Mobile) */}
        <div className="lg:hidden">
          <h2 className="text-lg font-bold text-gray-800">LapHub Admin</h2>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:block relative w-full max-w-md"
        >
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Mobile Search Icon */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition">
            <FiSearch size={18} />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <form onSubmit={handleSearch} className="md:hidden px-4 pb-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </form>
    </header>
  );
};

export default AdminHeader;
