import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiLogOut, FiMenu } from "react-icons/fi";
import toast from "react-hot-toast";

const AdminHeader = ({ setMobileSidebarOpen }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/admin/view-products?search=${encodeURIComponent(searchTerm)}`);
      setMobileSearchOpen(false);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 z-50 bg-white border-b shadow-sm h-14">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 lg:px-6">
        {/* Left - Mobile Menu Button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Open menu"
        >
          <FiMenu size={20} className="sm:w-5 sm:h-5" />
        </button>

        {/* Logo (Mobile) */}
        <div className="lg:hidden">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            LapHub Admin
          </h2>
        </div>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className="hidden md:block relative w-full max-w-md"
        >
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Search"
          >
            <FiSearch size={16} className="sm:w-4 sm:h-4" />
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <form onSubmit={handleSearch} className="md:hidden px-3 sm:px-4 pb-2">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              autoFocus
            />
          </div>
        </form>
      )}
    </header>
  );
};

export default AdminHeader;
