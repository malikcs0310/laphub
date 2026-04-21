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
} from "react-icons/fi";
import toast from "react-hot-toast";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const statusConfig = {
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: FiClock,
      label: "Pending",
    },
    processing: {
      color: "bg-blue-100 text-blue-800",
      icon: FiRefreshCw,
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

      {/* Stats Cards - Scrollable on mobile */}
      <div className="flex flex-nowrap sm:grid sm:grid-cols-2 md:grid-cols-5 gap-2 sm:gap-4 mb-4 sm:mb-6 overflow-x-auto pb-2 sm:pb-0">
        {Object.entries(statusConfig).map(([key, config]) => (
          <div
            key={key}
            className={`bg-white rounded-lg shadow p-2 sm:p-4 cursor-pointer transition-all hover:shadow-md flex-shrink-0 w-[100px] sm:w-auto ${
              filterStatus === key ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setFilterStatus(key)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] sm:text-xs text-gray-500 uppercase">
                  {config.label}
                </p>
                <p className="text-base sm:text-2xl font-bold text-gray-900">
                  {orders.filter((o) => o.orderStatus === key).length}
                </p>
              </div>
              <div className={`p-1.5 sm:p-2 rounded-lg ${config.color}`}>
                <config.icon size={14} className="sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        ))}
        <div
          className={`bg-white rounded-lg shadow p-2 sm:p-4 cursor-pointer transition-all hover:shadow-md flex-shrink-0 w-[100px] sm:w-auto ${
            filterStatus === "all" ? "ring-2 ring-blue-500" : ""
          }`}
          onClick={() => setFilterStatus("all")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] sm:text-xs text-gray-500 uppercase">
                All Orders
              </p>
              <p className="text-base sm:text-2xl font-bold text-gray-900">
                {orders.length}
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg">
              <FiPackage size={14} className="sm:w-5 sm:h-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
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

      {/* Orders Table - Horizontal scroll on mobile */}
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
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        {order.items?.length || 0} items
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
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <p className="text-[10px] sm:text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </p>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4">
                    <p className="font-bold text-blue-600 text-xs sm:text-sm">
                      {formatPrice(order.total)}
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
                      View
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
    </div>
  );
};

export default OrdersManagement;
