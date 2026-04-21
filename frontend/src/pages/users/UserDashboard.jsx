import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiShoppingBag,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiArrowRight,
} from "react-icons/fi";
import toast from "react-hot-toast";

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `Rs ${Number(price).toLocaleString()}`;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: FiClock,
        label: "Pending",
      },
      processing: {
        color: "bg-blue-100 text-blue-800",
        icon: FiClock,
        label: "Processing",
      },
      shipped: {
        color: "bg-purple-100 text-purple-800",
        icon: FiTruck,
        label: "Shipped",
      },
      delivered: {
        color: "bg-green-100 text-green-800",
        icon: FiCheckCircle,
        label: "Delivered",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: FiCheckCircle,
        label: "Cancelled",
      },
    };
    const c = config[status] || config.pending;
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${c.color}`}
      >
        <c.icon size={10} />
        {c.label}
      </span>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Section - Mobile Optimized */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 text-white">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0] || "User"}!
        </h1>
        <p className="text-blue-100 text-xs sm:text-sm mt-1 sm:mt-2">
          Track your orders, manage your profile, and discover new laptops.
        </p>
      </div>

      {/* Stats Cards - Mobile Optimized (2 columns on mobile, 3 on desktop) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Total Orders */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Total Orders
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>
            <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
              <FiPackage className="text-blue-600 text-base sm:text-lg md:text-xl" />
            </div>
          </div>
        </div>

        {/* Delivered Orders */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">Delivered</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                {orders.filter((o) => o.orderStatus === "delivered").length}
              </p>
            </div>
            <div className="bg-green-100 p-2 sm:p-3 rounded-full">
              <FiCheckCircle className="text-green-600 text-base sm:text-lg md:text-xl" />
            </div>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">Pending</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">
                {orders.filter((o) => o.orderStatus === "pending").length}
              </p>
            </div>
            <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
              <FiClock className="text-yellow-600 text-base sm:text-lg md:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders - Mobile Optimized */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Recent Orders
          </h2>
          <Link
            to="/user/orders"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs sm:text-sm"
          >
            View All
            <FiArrowRight size={12} className="sm:w-3.5 sm:h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <FiPackage className="mx-auto text-gray-400 text-3xl sm:text-4xl mb-2 sm:mb-3" />
            <p className="text-gray-500 text-sm sm:text-base">No orders yet</p>
            <Link
              to="/products"
              className="inline-block mt-3 sm:mt-4 text-blue-600 hover:underline text-xs sm:text-sm"
            >
              Start Shopping →
            </Link>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border rounded-lg sm:rounded-xl p-3 sm:p-4 hover:shadow-md transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                        {order.orderNumber}
                      </p>
                      {getStatusBadge(order.orderStatus)}
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600 mt-0.5 sm:mt-1">
                      {order.items?.length} item(s)
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
                    <div>
                      <p className="text-sm sm:text-base font-bold text-blue-600">
                        {formatPrice(order.total)}
                      </p>
                    </div>
                    <Link
                      to={`/user/orders/${order._id}`}
                      className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium whitespace-nowrap"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
