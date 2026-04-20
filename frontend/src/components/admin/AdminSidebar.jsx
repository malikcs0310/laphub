import { NavLink } from "react-router-dom";
import { useState } from "react";
import {
  FiGrid,
  FiPlusSquare,
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiMail,
  FiStar,
  FiMessageCircle,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { MdLaptop } from "react-icons/md";

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const menu = [
    { path: "/admin", label: "Dashboard", icon: FiGrid },
    { path: "/admin/add-laptop", label: "Add Laptop", icon: FiPlusSquare },
    { path: "/admin/view-products", label: "Products", icon: FiPackage },
    { path: "/admin/users", label: "Users", icon: FiUsers },
    { path: "/admin/orders", label: "Orders", icon: FiShoppingCart },
    { path: "/admin/manage-contacts", label: "Contacts", icon: FiMail },
    { path: "/admin/reviews", label: "Reviews", icon: FiStar },
    {
      path: "/admin/testimonials",
      label: "Testimonials",
      icon: FiMessageCircle,
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-700">
        <div className="bg-blue-600 p-2 rounded-lg">
          <MdLaptop size={24} />
        </div>
        <h2 className="text-xl font-bold">LapHub Admin</h2>
      </div>

      {/* Menu */}
      <nav className="p-4 space-y-2">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            onClick={() => setMobileOpen?.(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`
            }
          >
            <item.icon size={18} />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500 text-center">
          <p>LapHub.pk Admin Panel</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-50 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="relative h-full">
          {/* Close Button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-700 transition z-10"
          >
            <FiX size={22} />
          </button>
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
