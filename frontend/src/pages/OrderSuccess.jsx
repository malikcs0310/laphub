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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
            <FiPackage className="text-gray-400 text-3xl" />
          </div>
          <p className="text-gray-600">No order found</p>
          <Link
            to="/"
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700"
          >
            Go to Home
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
              <FiCheckCircle className="text-green-600 text-4xl" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-green-100">
              Thank you for shopping with LapHub.pk
            </p>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {/* Order Info */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Number</p>
                  <p className="text-lg font-bold text-gray-900">
                    {order.orderNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Date</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatDate(order.createdAt || new Date())}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                  <p className="text-lg font-bold text-gray-900">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : "Card Payment"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Status</p>
                  <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    {order.orderStatus || "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiPackage className="text-blue-600" />
                Order Summary
              </h2>
              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 pb-3 border-b">
                    <img
                      src={
                        item.image
                          ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/uploads/${item.image}`
                          : "https://via.placeholder.com/60x60?text=No+Image"
                      }
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-blue-600 mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Shipping</span>
                  <span>
                    {order.shipping === 0
                      ? "Free"
                      : formatPrice(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold text-gray-900 pt-3 border-t mt-3">
                  <span>Total</span>
                  <span className="text-2xl text-blue-600">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiPackage className="text-blue-600" />
                Delivery Information
              </h2>
              <div className="space-y-2">
                <p className="font-medium text-gray-900">
                  {order.customer?.name}
                </p>
                <p className="text-gray-600">{order.customer?.address}</p>
                <p className="text-gray-600">
                  {order.customer?.city}, {order.customer?.postalCode}
                </p>
                <p className="text-gray-600">{order.customer?.phone}</p>
                <p className="text-gray-600">{order.customer?.email}</p>
              </div>
            </div>

            {/* Estimated Delivery */}
            <div className="bg-blue-50 rounded-xl p-4 text-center mb-6">
              <p className="text-sm text-blue-600 mb-1">Estimated Delivery</p>
              <p className="text-lg font-bold text-blue-700">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/user/orders"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                <FiPackage className="mr-2" />
                Track Order
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-xl font-semibold transition"
              >
                <FiHome className="mr-2" />
                Continue Shopping
              </Link>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition"
              >
                <FiPrinter className="mr-2" />
                Print Receipt
              </button>
            </div>

            {/* Email Note */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
                <FiMail size={14} />A confirmation email has been sent to your
                email address
              </p>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="text-center mt-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl">
              <MdLaptop className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold text-gray-900">
              LapHub<span className="text-blue-600">.pk</span>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
