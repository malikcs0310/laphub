import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiPackage,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
  FiUser,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import toast from "react-hot-toast";

const UserOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setOrder(data.order);
      } else {
        toast.error(data.message || "Failed to fetch order");
        navigate("/user/orders");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Order cancelled successfully");
        fetchOrder();
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const formatPrice = (price) => `Rs ${Number(price).toLocaleString()}`;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="px-2 sm:px-0">
      {/* Back Button */}
      <button
        onClick={() => navigate("/user/orders")}
        className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-4 sm:mb-6 transition group text-sm sm:text-base"
      >
        <FiArrowLeft
          className="mr-1 sm:mr-2 group-hover:-translate-x-1 transition"
          size={14}
          className="sm:w-4 sm:h-4"
        />
        Back to Orders
      </button>

      {/* Order Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b p-4 sm:p-6 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
                {order.orderNumber}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              {getStatusBadge(order.orderStatus)}
              {order.orderStatus === "pending" && (
                <button
                  onClick={cancelOrder}
                  className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Order Items */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
              <FiPackage size={16} className="sm:w-4 sm:h-4" />
              Items
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-2 sm:gap-4 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl"
                >
                  <img
                    src={
                      item.image
                        ? `${API_URL}/uploads/${item.image}`
                        : "https://via.placeholder.com/80x80?text=No+Image"
                    }
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {item.title.length > 40
                        ? `${item.title.substring(0, 40)}...`
                        : item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-0.5 sm:mt-1">
                      {formatPrice(item.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info + Order Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Delivery Address */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <FiMapPin size={16} className="sm:w-4 sm:h-4" />
                Delivery Address
              </h2>
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-1 sm:space-y-2">
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {order.customer?.name}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {order.customer?.address}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {order.customer?.city}, {order.customer?.postalCode}
                </p>
                <p className="text-gray-600 text-xs sm:text-sm">
                  {order.customer?.phone}
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Order Summary
              </h2>
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 space-y-2 sm:space-y-3">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>
                    {order.shipping === 0
                      ? "Free"
                      : formatPrice(order.shipping)}
                  </span>
                </div>
                <div className="border-t pt-2 sm:pt-3 flex justify-between font-bold">
                  <span className="text-sm sm:text-base">Total</span>
                  <span className="text-base sm:text-xl text-blue-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
              Order Timeline
            </h2>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="text-green-600 text-sm sm:text-base" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm sm:text-base">
                    Order Placed
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>
              {order.orderStatus !== "pending" &&
                order.orderStatus !== "cancelled" && (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiClock className="text-blue-600 text-sm sm:text-base" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        Processing
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Order is being processed
                      </p>
                    </div>
                  </div>
                )}
              {order.orderStatus === "shipped" && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <FiTruck className="text-purple-600 text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Shipped
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {order.trackingNumber
                        ? `Tracking: ${order.trackingNumber}`
                        : "Your order is on the way"}
                    </p>
                  </div>
                </div>
              )}
              {order.orderStatus === "delivered" && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="text-green-600 text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Delivered
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Order has been delivered
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-3 sm:pt-4">
            <p className="text-xs sm:text-sm text-gray-500">
              Payment Method:{" "}
              {order.paymentMethod === "cod"
                ? "Cash on Delivery"
                : "Card Payment"}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
              Estimated Delivery: {formatDate(order.estimatedDelivery)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderDetails;
