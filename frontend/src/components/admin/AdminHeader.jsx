import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiMenu } from "react-icons/fi";
import toast from "react-hot-toast";

const AdminHeader = ({ setMobileSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("isAdmin");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-72 z-50 bg-white border-b shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 lg:px-6">
        {/* Left - Mobile Menu Button */}
        <button
          onClick={() => setMobileSidebarOpen(true)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          aria-label="Open menu"
        >
          <FiMenu size={20} className="sm:w-5 sm:h-5" />
        </button>

        {/* Logo */}
        <div className="lg:hidden">
          <h2 className="text-base sm:text-lg font-bold text-gray-800">
            LapHub Admin
          </h2>
        </div>

        {/* Desktop Logo */}
        <div className="hidden lg:block">
          <h2 className="text-lg font-bold text-gray-800">Admin Panel</h2>
        </div>

        {/* Right Side - Only Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-lg text-xs sm:text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
