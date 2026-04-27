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
  FiShoppingBag,
  FiCalendar,
  FiDollarSign,
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

  const getFullDate = (date) => {
    return new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        icon: FiClock,
        label: "Pending",
        description: "Order received, waiting for confirmation",
      },
      processing: {
        color: "bg-blue-100 text-blue-800",
        icon: FiClock,
        label: "Processing",
        description: "Your order is being prepared",
      },
      shipped: {
        color: "bg-purple-100 text-purple-800",
        icon: FiTruck,
        label: "Shipped",
        description: "Your order is on the way",
      },
      delivered: {
        color: "bg-green-100 text-green-800",
        icon: FiCheckCircle,
        label: "Delivered",
        description: "Order delivered successfully",
      },
      cancelled: {
        color: "bg-red-100 text-red-800",
        icon: FiXCircle,
        label: "Cancelled",
        description: "Order has been cancelled",
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon size={10} />
        {config.label}
      </span>
    );
  };

  const getStatusProgress = (status) => {
    switch (status) {
      case "pending":
        return 25;
      case "processing":
        return 50;
      case "shipped":
        return 75;
      case "delivered":
        return 100;
      default:
        return 0;
    }
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

  // Calculate total spent
  const totalSpent = orders
    .filter((o) => o.orderStatus === "delivered")
    .reduce((sum, o) => sum + (o.total || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      {/* Header with Stats */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          My Orders
        </h1>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-white">
            <div className="flex items-center gap-2">
              <FiShoppingBag size={16} />
              <p className="text-xs opacity-90">Total Orders</p>
            </div>
            <p className="text-2xl font-bold mt-1">{orders.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-3 text-white">
            <div className="flex items-center gap-2">
              <FiDollarSign size={16} />
              <p className="text-xs opacity-90">Total Spent</p>
            </div>
            <p className="text-lg font-bold mt-1">{formatPrice(totalSpent)}</p>
          </div>
        </div>
      </div>

      {/* Status Filters - Mobile Optimized (Scrollable on mobile) */}
      <div className="flex flex-nowrap sm:flex-wrap gap-1.5 sm:gap-2 mb-4 overflow-x-auto pb-2 sm:pb-0">
        {[
          {
            key: "all",
            label: "All",
            count: statusCounts.all,
            color: "bg-gray-600",
          },
          {
            key: "pending",
            label: "Pending",
            count: statusCounts.pending,
            color: "bg-yellow-500",
          },
          {
            key: "processing",
            label: "Processing",
            count: statusCounts.processing,
            color: "bg-blue-500",
          },
          {
            key: "shipped",
            label: "Shipped",
            count: statusCounts.shipped,
            color: "bg-purple-500",
          },
          {
            key: "delivered",
            label: "Delivered",
            count: statusCounts.delivered,
            color: "bg-green-500",
          },
          {
            key: "cancelled",
            label: "Cancelled",
            count: statusCounts.cancelled,
            color: "bg-red-500",
          },
        ].map((status) => (
          <button
            key={status.key}
            onClick={() => setFilter(status.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap flex items-center gap-1 ${
              filter === status.key
                ? `${status.color} text-white`
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {status.label}
            <span
              className={`px-1.5 py-0.5 rounded-full text-[9px] ${
                filter === status.key
                  ? "bg-white/20"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status.count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by order number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
          <FiPackage className="mx-auto text-gray-400 text-4xl sm:text-5xl mb-3" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            {searchTerm
              ? `No orders matching "${searchTerm}"`
              : filter !== "all"
                ? `You have no ${filter} orders`
                : "You haven't placed any orders yet"}
          </p>
          <Link
            to="/products"
            className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition text-sm"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              {/* Order Header */}
              <div className="p-4 border-b bg-gradient-to-r from-gray-50 to-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-gray-900 text-sm">
                      {order.orderNumber}
                    </p>
                    {getStatusBadge(order.orderStatus)}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiCalendar size={12} />
                    <span>{getFullDate(order.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar for Active Orders */}
              {order.orderStatus !== "delivered" &&
                order.orderStatus !== "cancelled" && (
                  <div className="px-4 pt-3">
                    <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                      <span>Ordered</span>
                      <span>Processing</span>
                      <span>Shipped</span>
                      <span>Delivered</span>
                    </div>
                    <div className="overflow-hidden h-1.5 text-xs flex rounded bg-gray-200">
                      <div
                        style={{
                          width: `${getStatusProgress(order.orderStatus)}%`,
                        }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                      ></div>
                    </div>
                  </div>
                )}

              {/* Order Content */}
              <div className="p-4">
                {/* Items Preview */}
                <div className="flex gap-2 mb-3 flex-wrap">
                  {order.items?.slice(0, 2).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg p-2"
                    >
                      {item.image ? (
                        <img
                          src={`${API_URL}/uploads/${item.image}`}
                          alt={item.title}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          <FiPackage className="text-gray-400 text-sm" />
                        </div>
                      )}
                      <div>
                        <p className="text-xs font-medium text-gray-900 max-w-[120px] line-clamp-1">
                          {item.title}
                        </p>
                        <p className="text-[9px] text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                  {order.items?.length > 2 && (
                    <div className="flex items-center bg-gray-50 rounded-lg p-2">
                      <p className="text-xs text-gray-500">
                        +{order.items.length - 2} more
                      </p>
                    </div>
                  )}
                </div>

                {/* Order Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t">
                  <div>
                    <p className="text-xs text-gray-500">
                      {order.items?.length} item(s)
                    </p>
                    <p className="text-xs text-gray-500">
                      Payment:{" "}
                      {order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Card"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">
                      {formatPrice(order.total)}
                    </p>
                    <Link
                      to={`/user/orders/${order._id}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mt-1"
                    >
                      <FiEye size={12} />
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 text-center text-[10px] text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
};

export default UserOrders;
