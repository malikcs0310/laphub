import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  FiCalendar,
  FiDollarSign,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const UserOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

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
    if (
      !confirm(
        "Are you sure you want to cancel this order? This action cannot be undone.",
      )
    )
      return;

    setCancelling(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        toast.success(
          "Order cancelled successfully. Your payment will be refunded within 3-5 business days.",
        );
        fetchOrder();
      } else {
        toast.error(data.message || "Failed to cancel order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setCancelling(false);
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
        description: "Order has been delivered",
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
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon size={12} />
        {config.label}
      </span>
    );
  };

  // Get estimated delivery date
  const getEstimatedDelivery = () => {
    if (order?.orderStatus === "delivered") {
      return "Delivered";
    }
    if (order?.orderStatus === "cancelled") {
      return "Cancelled";
    }
    const orderDate = new Date(order?.createdAt);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + 5);
    return estimatedDate.toLocaleDateString("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
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

  const canCancel =
    order.orderStatus === "pending" || order.orderStatus === "processing";

  return (
    <div className="px-2 sm:px-0 pb-8">
      {/* Back Button */}
      <button
        onClick={() => navigate("/user/orders")}
        className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-4 sm:mb-6 transition group text-sm sm:text-base"
      >
        <FiArrowLeft
          className="mr-1 sm:mr-2 group-hover:-translate-x-1 transition"
          size={14}
        />
        Back to Orders
      </button>

      {/* Order Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden">
        {/* Header with Gradient */}
        <div className="border-b p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-1">
                Order #{order.orderNumber}
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              {getStatusBadge(order.orderStatus)}
              {canCancel && (
                <button
                  onClick={cancelOrder}
                  disabled={cancelling}
                  className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-medium disabled:opacity-50"
                >
                  {cancelling ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Order Progress Bar */}
        <div className="p-4 sm:p-6 border-b">
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{
                  width:
                    order.orderStatus === "pending"
                      ? "25%"
                      : order.orderStatus === "processing"
                        ? "50%"
                        : order.orderStatus === "shipped"
                          ? "75%"
                          : order.orderStatus === "delivered"
                            ? "100%"
                            : "0%",
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
              ></div>
            </div>
            <div className="flex justify-between text-[10px] sm:text-xs text-gray-500">
              <span
                className={
                  order.orderStatus !== "cancelled"
                    ? "text-blue-600 font-medium"
                    : ""
                }
              >
                Order Placed
              </span>
              <span
                className={
                  order.orderStatus === "processing" ||
                  order.orderStatus === "shipped" ||
                  order.orderStatus === "delivered"
                    ? "text-blue-600 font-medium"
                    : ""
                }
              >
                Processing
              </span>
              <span
                className={
                  order.orderStatus === "shipped" ||
                  order.orderStatus === "delivered"
                    ? "text-blue-600 font-medium"
                    : ""
                }
              >
                Shipped
              </span>
              <span
                className={
                  order.orderStatus === "delivered"
                    ? "text-blue-600 font-medium"
                    : ""
                }
              >
                Delivered
              </span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <p className="text-xs text-gray-500">
              Estimated Delivery: {getEstimatedDelivery()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 sm:space-y-6">
          {/* Order Items with Specs */}
          <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
              <FiPackage size={16} />
              Items ({order.items?.length || 0})
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
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.processor && (
                        <span className="text-[9px] sm:text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded">
                          {item.processor}
                        </span>
                      )}
                      {item.ram && (
                        <span className="text-[9px] sm:text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded">
                          {item.ram}
                        </span>
                      )}
                      {item.storage && (
                        <span className="text-[9px] sm:text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded">
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

          {/* Delivery Info + Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Delivery Address */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <FiMapPin size={16} />
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
                <div className="flex items-center gap-2 pt-1">
                  <FiPhone size={12} className="text-gray-400" />
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {order.customer?.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail size={12} className="text-gray-400" />
                  <p className="text-gray-600 text-xs sm:text-sm">
                    {order.customer?.email}
                  </p>
                </div>
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
                {order.discount && order.discount > 0 && (
                  <div className="flex justify-between text-xs sm:text-sm text-green-600">
                    <span>Discount</span>
                    <span>- {formatPrice(order.discount)}</span>
                  </div>
                )}
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
              <div className="flex items-start gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
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
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiClock className="text-blue-600 text-sm sm:text-base" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm sm:text-base">
                        Processing
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        Your order is being prepared for shipment
                      </p>
                    </div>
                  </div>
                )}

              {order.orderStatus === "shipped" && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiTruck className="text-purple-600 text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Shipped
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {order.trackingNumber
                        ? `Tracking Number: ${order.trackingNumber}`
                        : "Your order is on the way to your address"}
                    </p>
                  </div>
                </div>
              )}

              {order.orderStatus === "delivered" && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheckCircle className="text-green-600 text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Delivered
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Order has been successfully delivered
                    </p>
                  </div>
                </div>
              )}

              {order.orderStatus === "cancelled" && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiXCircle className="text-red-600 text-sm sm:text-base" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">
                      Cancelled
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      This order has been cancelled
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-3 sm:pt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
            <div>
              <p className="text-xs sm:text-sm text-gray-500">
                Payment Method:{" "}
                <span className="font-medium text-gray-700">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Card Payment"}
                </span>
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                Payment Status:{" "}
                <span
                  className={`font-medium ${order.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}
                >
                  {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                </span>
              </p>
            </div>
            {order.notes && (
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Order Notes:{" "}
                  <span className="text-gray-700">{order.notes}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-400">
          Need help?{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact Customer Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default UserOrderDetails;
