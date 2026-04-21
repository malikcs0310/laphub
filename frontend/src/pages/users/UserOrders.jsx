import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiSearch,
  FiEye,
} from "react-icons/fi";
import toast from "react-hot-toast";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
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
        setOrders(data.orders);
      } else {
        toast.error(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Something went wrong");
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
    const statusConfig = {
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
        icon: FiXCircle,
        label: "Cancelled",
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${config.color}`}
      >
        <Icon size={10} className="sm:w-3 sm:h-3" />
        {config.label}
      </span>
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filter === "all" || order.orderStatus === filter;
    const matchesSearch = order.orderNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    all: orders.length,
    pending: orders.filter((o) => o.orderStatus === "pending").length,
    processing: orders.filter((o) => o.orderStatus === "processing").length,
    shipped: orders.filter((o) => o.orderStatus === "shipped").length,
    delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    cancelled: orders.filter((o) => o.orderStatus === "cancelled").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        My Orders
      </h1>

      {/* Status Filters - Mobile Optimized (Scrollable on mobile) */}
      <div className="flex flex-nowrap sm:flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6 overflow-x-auto pb-2 sm:pb-0">
        {[
          { key: "all", label: "All", count: statusCounts.all },
          { key: "pending", label: "Pending", count: statusCounts.pending },
          {
            key: "processing",
            label: "Processing",
            count: statusCounts.processing,
          },
          { key: "shipped", label: "Shipped", count: statusCounts.shipped },
          {
            key: "delivered",
            label: "Delivered",
            count: statusCounts.delivered,
          },
          {
            key: "cancelled",
            label: "Cancelled",
            count: statusCounts.cancelled,
          },
        ].map((status) => (
          <button
            key={status.key}
            onClick={() => setFilter(status.key)}
            className={`px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg text-[11px] sm:text-sm font-medium transition whitespace-nowrap ${
              filter === status.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {status.label} ({status.count})
          </button>
        ))}
      </div>

      {/* Search - Mobile Optimized */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Orders List - Mobile Optimized */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-8 sm:p-12 text-center">
          <FiPackage className="mx-auto text-gray-400 text-4xl sm:text-5xl mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mb-5 sm:mb-6">
            {searchTerm
              ? `No orders matching "${searchTerm}"`
              : filter !== "all"
                ? `You have no ${filter} orders`
                : "You haven't placed any orders yet"}
          </p>
          <Link
            to="/products"
            className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 sm:px-6 sm:py-2 rounded-lg transition text-sm sm:text-base"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {order.orderNumber}
                    </p>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                    {order.items?.length} item(s)
                  </p>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-base sm:text-xl font-bold text-blue-600">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
                    Est. delivery: {formatDate(order.estimatedDelivery)}
                  </p>
                </div>
                <Link
                  to={`/user/orders/${order._id}`}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 text-xs sm:text-sm font-medium transition"
                >
                  <FiEye size={12} className="sm:w-3.5 sm:h-3.5" />
                  View Details
                </Link>
              </div>

              {/* Quick Items Preview - Mobile Optimized */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex gap-2 sm:gap-3 overflow-x-auto pb-1">
                {order.items?.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 sm:gap-2 bg-gray-50 rounded-lg p-1.5 sm:p-2 flex-shrink-0"
                  >
                    {item.image ? (
                      <img
                        src={`${API_URL}/uploads/${item.image}`}
                        alt={item.title}
                        className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded flex items-center justify-center">
                        <FiPackage className="text-gray-400 text-xs sm:text-sm" />
                      </div>
                    )}
                    <div className="max-w-[100px] sm:max-w-none">
                      <p className="text-[10px] sm:text-xs font-medium text-gray-900 line-clamp-1">
                        {item.title.length > 30
                          ? `${item.title.substring(0, 30)}...`
                          : item.title}
                      </p>
                      <p className="text-[9px] sm:text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <div className="flex items-center bg-gray-50 rounded-lg p-1.5 sm:p-2 flex-shrink-0">
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      +{order.items.length - 3} more
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserOrders;
