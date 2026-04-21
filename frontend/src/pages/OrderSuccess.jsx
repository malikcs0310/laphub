import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FiCheckCircle,
  FiPackage,
  FiArrowRight,
  FiPrinter,
  FiMail,
  FiHome,
} from "react-icons/fi";
import { MdLaptop } from "react-icons/md";

const OrderSuccess = () => {
  const location = useLocation();
  const order = location.state?.order;

  const formatPrice = (price) => {
    return `Rs ${Number(price).toLocaleString()}`;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-3 sm:mb-4">
            <FiPackage className="text-gray-400 text-2xl sm:text-3xl" />
          </div>
          <p className="text-gray-600 text-sm sm:text-base">No order found</p>
          <Link
            to="/"
            className="inline-flex items-center mt-3 sm:mt-4 text-blue-600 hover:text-blue-700 text-sm sm:text-base"
          >
            Go to Home
            <FiArrowRight
              className="ml-1 sm:ml-2"
              size={14}
              className="sm:w-4 sm:h-4"
            />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-3 sm:px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Success Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 sm:px-6 py-6 sm:py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full mb-3 sm:mb-4">
              <FiCheckCircle className="text-green-600 text-3xl sm:text-4xl" />
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-green-100 text-xs sm:text-sm md:text-base">
              Thank you for shopping with LapHub.pk
            </p>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 md:p-8">
            {/* Order Info */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-5 sm:mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                    Order Number
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 break-all">
                    {order.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                    Order Date
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                    {formatDate(order.createdAt || new Date())}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                    Payment Method
                  </p>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Card Payment"}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500 mb-0.5 sm:mb-1">
                    Order Status
                  </p>
                  <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 bg-yellow-100 text-yellow-800 rounded-full text-[10px] sm:text-xs md:text-sm font-medium">
                    {order.orderStatus || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-5 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <FiPackage
                  className="text-blue-600"
                  size={16}
                  className="sm:w-4 sm:h-4"
                />
                Order Summary
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {order.items?.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 sm:gap-3 pb-2 sm:pb-3 border-b"
                  >
                    <img
                      src={
                        item.image
                          ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${item.image}`
                          : "https://via.placeholder.com/60x60?text=No+Image"
                      }
                      alt={item.title}
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 text-xs sm:text-sm md:text-base">
                        {item.title.length > 40
                          ? `${item.title.substring(0, 40)}...`
                          : item.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-xs sm:text-sm font-semibold text-blue-600 mt-0.5 sm:mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
                {order.items?.length > 3 && (
                  <p className="text-center text-gray-500 text-xs sm:text-sm">
                    +{order.items.length - 3} more items
                  </p>
                )}
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                <div className="flex justify-between text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0
                      ? "Free"
                      : formatPrice(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 pt-2 sm:pt-3 border-t mt-2 sm:mt-3">
                  <span>Total</span>
                  <span className="text-xl sm:text-2xl text-blue-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-5 sm:mb-6">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-1.5 sm:gap-2">
                <FiPackage
                  className="text-blue-600"
                  size={16}
                  className="sm:w-4 sm:h-4"
                />
                Delivery Information
              </h2>
              <div className="space-y-1 sm:space-y-2 text-sm sm:text-base">
                <p className="font-medium text-gray-900">
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
                <p className="text-gray-600 text-xs sm:text-sm">
                  {order.customer?.email}
                </p>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4 text-center mb-5 sm:mb-6">
              <p className="text-xs sm:text-sm text-blue-600 mb-0.5 sm:mb-1">
                Estimated Delivery
              </p>
              <p className="text-base sm:text-lg font-bold text-blue-700">
                {order.estimatedDelivery
                  ? new Date(order.estimatedDelivery).toLocaleDateString(
                      "en-PK",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  : "3-5 business days"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Link
                to="/user/orders"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition text-sm sm:text-base"
              >
                <FiPackage
                  className="mr-1 sm:mr-2"
                  size={14}
                  className="sm:w-4 sm:h-4"
                />
                Track Order
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition text-sm sm:text-base"
              >
                <FiHome
                  className="mr-1 sm:mr-2"
                  size={14}
                  className="sm:w-4 sm:h-4"
                />
                Continue Shopping
              </Link>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition text-sm sm:text-base"
              >
                <FiPrinter
                  className="mr-1 sm:mr-2"
                  size={14}
                  className="sm:w-4 sm:h-4"
                />
                Print Receipt
              </button>
            </div>

            {/* Email Note */}
            <div className="mt-5 sm:mt-6 text-center">
              <p className="text-[10px] sm:text-xs text-gray-500 flex items-center justify-center gap-1">
                <FiMail size={12} className="sm:w-3.5 sm:h-3.5" />A confirmation
                email has been sent to your email address
              </p>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mt-6 sm:mt-8">
          <Link to="/" className="inline-flex items-center gap-1.5 sm:gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
              <MdLaptop className="text-white text-lg sm:text-xl md:text-2xl" />
            </div>
            <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
              LapHub<span className="text-blue-600">.pk</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
