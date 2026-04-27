import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiEye,
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiTruck,
  FiClock,
  FiXCircle,
  FiAlertCircle,
  FiDollarSign,
  FiUsers,
  FiShoppingBag,
} from "react-icons/fi";
import toast from "react-hot-toast";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: FiClock,
      label: "Pending",
      order: 1,
    },
    processing: {
      color: "bg-blue-100 text-blue-800",
      icon: FiRefreshCw,
      label: "Processing",
      order: 2,
    },
    shipped: {
      color: "bg-purple-100 text-purple-800",
      icon: FiTruck,
      label: "Shipped",
      order: 3,
    },
    delivered: {
      color: "bg-green-100 text-green-800",
      icon: FiCheckCircle,
      label: "Delivered",
      order: 4,
    },
    cancelled: {
      color: "bg-red-100 text-red-800",
      icon: FiXCircle,
      label: "Cancelled",
      order: 5,
    },
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch orders");
      setOrders(data.orders);

      // Calculate statistics
      const totalRevenue = data.orders
        .filter((o) => o.orderStatus === "delivered")
        .reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        totalOrders: data.orders.length,
        totalRevenue: totalRevenue,
        pendingOrders: data.orders.filter((o) => o.orderStatus === "pending")
          .length,
        completedOrders: data.orders.filter(
          (o) => o.orderStatus === "delivered",
        ).length,
      });
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.phone?.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || order.orderStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatPrice = (price) => `Rs ${Number(price).toLocaleString()}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const getDaysSince = (date) => {
    const orderDate = new Date(date);
    const today = new Date();
    const diffTime = Math.abs(today - orderDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const StatusBadge = ({ status }) => {
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium ${config.color}`}
      >
        <Icon size={10} />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Order Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          Manage and track all customer orders
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase">
                Total Orders
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiShoppingBag className="text-blue-600 text-sm sm:text-base" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase">
                Total Revenue
              </p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="text-green-600 text-sm sm:text-base" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase">
                Pending
              </p>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                {stats.pendingOrders}
              </p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-600 text-sm sm:text-base" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500 uppercase">
                Completed
              </p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {stats.completedOrders}
              </p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCheckCircle className="text-green-600 text-sm sm:text-base" />
            </div>
          </div>
        </div>
      </div>

      {/* Status Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setFilterStatus("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
            filterStatus === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          All ({orders.length})
        </button>
        {Object.entries(statusConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilterStatus(key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1 ${
              filterStatus === key
                ? `${config.color} ring-2 ring-offset-1`
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <config.icon size={12} />
            {config.label} ({orders.filter((o) => o.orderStatus === key).length}
            )
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow mb-4 sm:mb-6 p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
            <input
              type="text"
              placeholder="Search by order number, customer name, email, or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-sm"
          >
            <FiRefreshCw size={12} className="sm:w-4 sm:h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] sm:min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Order
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition">
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">
                        {order.orderNumber}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-400">
                        {getDaysSince(order.createdAt)} days ago
                      </p>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div>
                      <p className="font-medium text-gray-900 text-xs sm:text-sm">
                        {order.customer?.name?.split(" ")[0] ||
                          order.customer?.name}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 truncate max-w-[120px] sm:max-w-none">
                        {order.customer?.email}
                      </p>
                      {order.customer?.phone && (
                        <p className="text-[9px] sm:text-[10px] text-gray-400 mt-0.5">
                          {order.customer.phone}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <p className="text-[10px] sm:text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </p>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-1">
                      <FiPackage size={12} className="text-gray-400" />
                      <span className="text-xs text-gray-900">
                        {order.items?.length || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <p className="font-bold text-blue-600 text-xs sm:text-sm">
                      {formatPrice(order.total)}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-gray-400">
                      {order.paymentMethod === "cod" ? "COD" : "Card"}
                    </p>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 text-right">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="inline-flex items-center gap-0.5 sm:gap-1 px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-xs sm:text-sm"
                    >
                      <FiEye size={12} className="sm:w-4 sm:h-4" />
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <FiAlertCircle className="mx-auto text-gray-400 text-3xl sm:text-5xl" />
            <h3 className="mt-2 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">
              No orders found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Try adjusting your search or filter.
            </p>
          </div>
        )}
      </div>

      {/* Export Hint */}
      {filteredOrders.length > 0 && (
        <div className="mt-4 text-center text-[10px] sm:text-xs text-gray-400">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;
