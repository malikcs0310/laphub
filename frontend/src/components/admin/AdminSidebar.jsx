import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiGrid,
  FiPlusSquare,
  FiPackage,
  FiUsers,
  FiShoppingCart,
  FiMail,
  FiStar,
  FiMessageCircle,
  FiX,
} from "react-icons/fi";
import { MdLaptop } from "react-icons/md";

const AdminSidebar = ({ mobileOpen, setMobileOpen }) => {
  const [badges, setBadges] = useState({
    orders: 0,
    reviews: 0,
    testimonials: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Fetch all counts on mount and every 30 seconds
  useEffect(() => {
    fetchBadgeCounts();

    // Refresh every 30 seconds
    const interval = setInterval(fetchBadgeCounts, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchBadgeCounts = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      // Fetch pending orders count
      const ordersRes = await fetch(`${API_URL}/api/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();
      const pendingOrdersCount =
        ordersData.orders?.filter((order) => order.orderStatus === "pending")
          .length || 0;

      // Fetch pending reviews count
      const reviewsRes = await fetch(`${API_URL}/api/reviews/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const reviewsData = await reviewsRes.json();
      const pendingReviewsCount =
        reviewsData.reviews?.filter((review) => review.status === "pending")
          .length || 0;

      // Fetch pending testimonials count
      const testimonialsRes = await fetch(
        `${API_URL}/api/testimonials/admin/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const testimonialsData = await testimonialsRes.json();
      const pendingTestimonialsCount =
        testimonialsData.testimonials?.filter(
          (testimonial) => testimonial.status === "pending",
        ).length || 0;

      setBadges({
        orders: pendingOrdersCount,
        reviews: pendingReviewsCount,
        testimonials: pendingTestimonialsCount,
      });
    } catch (error) {
      console.error("Error fetching badge counts:", error);
    }
  };

  // Call this function when navigating to clear badge
  const clearBadge = (type) => {
    setBadges((prev) => ({
      ...prev,
      [type]: 0,
    }));
  };

  const menu = [
    { path: "/admin", label: "Dashboard", icon: FiGrid, badge: null },
    {
      path: "/admin/add-laptop",
      label: "Add Laptop",
      icon: FiPlusSquare,
      badge: null,
    },
    {
      path: "/admin/view-products",
      label: "Products",
      icon: FiPackage,
      badge: null,
    },
    { path: "/admin/users", label: "Users", icon: FiUsers, badge: null },
    {
      path: "/admin/orders",
      label: "Orders",
      icon: FiShoppingCart,
      badge: "orders",
      badgeColor: "bg-blue-500",
    },
    {
      path: "/admin/manage-contacts",
      label: "Contacts",
      icon: FiMail,
      badge: null,
    },
    {
      path: "/admin/reviews",
      label: "Reviews",
      icon: FiStar,
      badge: "reviews",
      badgeColor: "bg-yellow-500",
    },
    {
      path: "/admin/testimonials",
      label: "Testimonials",
      icon: FiMessageCircle,
      badge: "testimonials",
      badgeColor: "bg-purple-500",
    },
  ];

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-700">
        <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
          <MdLaptop size={20} className="sm:w-6 sm:h-6" />
        </div>
        <h2 className="text-base sm:text-xl font-bold">LapHub Admin</h2>
      </div>

      {/* Menu */}
      <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2">
        {menu.map((item, index) => {
          const badgeCount = item.badge ? badges[item.badge] : 0;
          const badgeColor = item.badgeColor || "bg-blue-500";

          return (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => {
                if (item.badge) {
                  clearBadge(item.badge);
                }
                setMobileOpen?.(false);
              }}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`
              }
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <item.icon size={16} className="sm:w-4 sm:h-4" />
                <span className="font-medium text-xs sm:text-sm">
                  {item.label}
                </span>
              </div>
              {badgeCount > 0 && (
                <span
                  className={`${badgeColor} text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center`}
                >
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-gray-700">
        <div className="text-[10px] sm:text-xs text-gray-500 text-center">
          <p>LapHub.pk Admin Panel</p>
          <p className="mt-0.5 sm:mt-1">v1.0.0</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-screen w-64 sm:w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-40 overflow-y-auto">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 sm:w-72 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out lg:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="relative h-full">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-lg hover:bg-gray-700 transition z-10"
          >
            <FiX size={18} className="sm:w-5 sm:h-5" />
          </button>
          <SidebarContent />
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
