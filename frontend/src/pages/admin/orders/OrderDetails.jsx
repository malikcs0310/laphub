import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiTruck,
  FiPackage,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
      icon: FiClock,
      description: "Order received, waiting for confirmation",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-blue-100 text-blue-800",
      icon: FiRefreshCw,
      description: "Order is being processed",
    },
    {
      value: "shipped",
      label: "Shipped",
      color: "bg-purple-100 text-purple-800",
      icon: FiTruck,
      description: "Order has been shipped",
    },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
      icon: FiCheckCircle,
      description: "Order delivered successfully",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
      icon: FiXCircle,
      description: "Order has been cancelled",
    },
  ];

  const fetchOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch order");
      setOrder(data.order);
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Failed to load order details");
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const token = localStorage.getItem("adminToken");

      // Get current status
      const currentStatus = order.orderStatus;

      const response = await fetch(`${API_URL}/api/orders/admin/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          orderStatus: newStatus,
          previousStatus: currentStatus,
        }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update status");

      setOrder(data.order);

      // Show appropriate message based on status change
      if (newStatus === "cancelled" && currentStatus !== "cancelled") {
        toast.success(
          `Order #${order.orderNumber} has been cancelled. Stock has been restored.`,
        );
      } else if (newStatus === "delivered") {
        toast.success(`Order #${order.orderNumber} marked as delivered.`);
      } else {
        toast.success(`Order status updated to ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update order status");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const formatPrice = (price) => `Rs ${Number(price).toLocaleString()}`;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusConfig = (status) =>
    statusOptions.find((s) => s.value === status) || statusOptions[0];

  // Get status history steps
  const getStatusSteps = () => {
    const steps = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = steps.indexOf(order?.orderStatus);

    return steps.map((step, index) => {
      const statusConfig = getStatusConfig(step);
      const isCompleted = index <= currentIndex;
      const isCurrent = step === order?.orderStatus;

      return {
        ...statusConfig,
        isCompleted,
        isCurrent,
        stepIndex: index,
      };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order.orderStatus);
  const StatusIcon = statusConfig.icon;
  const statusSteps = getStatusSteps();

  return (
    <div className="p-3 sm:p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <button
          onClick={() => navigate("/admin/orders")}
          className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-3 sm:mb-4 transition group text-sm sm:text-base"
        >
          <FiArrowLeft
            className="mr-1 sm:mr-2 group-hover:-translate-x-1 transition"
            size={14}
          />
          Back to Orders
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div
              className={`inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-4 sm:py-2 rounded-full ${statusConfig.color}`}
            >
              <StatusIcon size={14} className="sm:w-4 sm:h-4" />
              <span className="font-medium text-xs sm:text-sm">
                {statusConfig.label}
              </span>
            </div>

            {/* Status Update Dropdown */}
            {order.orderStatus !== "delivered" &&
              order.orderStatus !== "cancelled" && (
                <select
                  value={order.orderStatus}
                  onChange={(e) => updateOrderStatus(e.target.value)}
                  disabled={updating}
                  className="px-2 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6 mb-5 sm:mb-6">
        <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">
          Order Status Timeline
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          <div className="space-y-6 relative">
            {statusSteps.map((step, idx) => (
              <div
                key={step.value}
                className="relative flex items-start gap-3 sm:gap-4"
              >
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    step.isCompleted
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step.isCompleted ? (
                    <FiCheckCircle size={16} />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      className={`font-semibold text-sm sm:text-base ${
                        step.isCurrent ? "text-blue-600" : "text-gray-900"
                      }`}
                    >
                      {step.label}
                    </h3>
                    {step.isCurrent && (
                      <span className="text-[10px] sm:text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {step.description}
                  </p>
                  {step.isCompleted && idx === 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Order confirmed
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5 sm:gap-6">
        {/* Order Items */}
        <div className="lg:flex-[2] space-y-5 sm:space-y-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
              <FiPackage size={16} className="sm:w-4 sm:h-4" />
              Order Items
            </h2>
            <div className="space-y-3 sm:space-y-4">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 sm:gap-4 pb-3 sm:pb-4 border-b last:border-0"
                >
                  <img
                    src={
                      item.image
                        ? `${API_URL}/uploads/${item.image}`
                        : "https://via.placeholder.com/80x80?text=No+Image"
                    }
                    alt={item.title}
                    className="w-14 h-14 sm:w-20 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {item.title.length > 40
                        ? `${item.title.substring(0, 40)}...`
                        : item.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.processor && (
                        <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {item.processor}
                        </span>
                      )}
                      {item.ram && (
                        <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {item.ram}
                        </span>
                      )}
                      {item.storage && (
                        <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {item.storage}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-0.5 sm:mt-1">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Order Summary */}
        <div className="lg:flex-1 space-y-4 sm:space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
              <FiUser size={16} className="sm:w-4 sm:h-4" />
              Customer Information
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-start gap-2 sm:gap-3">
                <FiUser className="text-gray-400 mt-0.5 text-sm sm:text-base" />
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    {order.customer?.name}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Name</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <FiMail className="text-gray-400 mt-0.5 text-sm sm:text-base" />
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    {order.customer?.email}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:gap-3">
                <FiPhone className="text-gray-400 mt-0.5 text-sm sm:text-base" />
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    {order.customer?.phone}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
              <FiMapPin size={16} className="sm:w-4 sm:h-4" />
              Shipping Address
            </h2>
            <div className="space-y-0.5 sm:space-y-1">
              <p className="font-medium text-gray-900 text-sm sm:text-base">
                {order.customer?.address}
              </p>
              <div className="flex flex-wrap gap-2">
                <p className="text-gray-600 text-xs sm:text-sm">
                  {order.customer?.city}
                </p>
                {order.customer?.city && order.customer?.postalCode && (
                  <span>•</span>
                )}
                <p className="text-gray-600 text-xs sm:text-sm">
                  {order.customer?.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                <span>Shipping</span>
                <span>
                  {order.shipping === 0 ? "Free" : formatPrice(order.shipping)}
                </span>
              </div>
              <div className="border-t pt-2 sm:pt-3 mt-2 sm:mt-3">
                <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-lg sm:text-2xl text-blue-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
              Payment Information
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Method</span>
                <span className="font-medium text-gray-900">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Card Payment"}
                </span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-600">Status</span>
                <span
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                </span>
              </div>
              {order.notes && (
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">
                    Order Notes
                  </p>
                  <p className="text-gray-700 text-xs sm:text-sm">
                    {order.notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
