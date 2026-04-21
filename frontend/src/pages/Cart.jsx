import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiShoppingCart,
  FiArrowRight,
  FiTruck,
  FiPackage,
  FiClock,
  FiShield,
  FiHeart,
} from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import toast from "react-hot-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    loadCart();
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(cart);
  };

  const removeFromCart = (id) => {
    const updatedCart = cartItems.filter((item) => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed from cart", { icon: "🗑️", duration: 2000 });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty", { icon: "🛒", duration: 2000 });
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login to checkout", {
        icon: "🔐",
        duration: 3000,
        style: { background: "linear-gradient(135deg, #991b1b, #ef4444)" },
      });
      setTimeout(
        () => navigate("/login", { state: { from: "/checkout" } }),
        500,
      );
      return;
    }

    toast.success("Redirecting to secure checkout...", {
      icon: "💨",
      duration: 1500,
    });
    setTimeout(() => navigate("/checkout"), 800);
  };

  const handleBuyNow = (product) => {
    if (!isLoggedIn) {
      toast.error("Please login to buy", { icon: "🔐", duration: 2000 });
      setTimeout(
        () =>
          navigate("/login", { state: { from: `/product/${product._id}` } }),
        500,
      );
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = existingCart.some((item) => item._id === product._id);

    if (!exists) {
      existingCart.push(product);
      localStorage.setItem("cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Product added to cart", { icon: "✨", duration: 1500 });
    }
    setTimeout(() => navigate("/checkout"), 800);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + (Number(item.price) || 0),
    0,
  );
  const shipping = subtotal > 50000 ? 0 : 300;
  const total = subtotal + shipping;
  const remainingForFreeShipping = subtotal > 50000 ? 0 : 50000 - subtotal;

  const formatPrice = (price) => `Rs ${Number(price).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Your Cart
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {cartItems.length === 0
              ? "Your cart is empty"
              : `${cartItems.length} ${cartItems.length === 1 ? "item" : "items"} in your cart`}
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State - Mobile Optimized
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full mb-4 sm:mb-6">
              <FiShoppingCart className="text-gray-400 text-3xl sm:text-4xl" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6 sm:mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg text-sm sm:text-base"
            >
              Continue Shopping
              <FiArrowRight className="ml-2" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:flex-[2] space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center border border-gray-100"
                >
                  {/* Product Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden">
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? `${API_URL}/uploads/${item.images[0]}`
                          : "https://via.placeholder.com/150x150?text=No+Image"
                      }
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 w-full text-center sm:text-left">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-base sm:text-lg md:text-xl font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                      {item.brand} {item.model}
                    </p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-2 justify-center sm:justify-start">
                      {item.processor && (
                        <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                          {item.processor.length > 20
                            ? `${item.processor.substring(0, 20)}...`
                            : item.processor}
                        </span>
                      )}
                      {item.ram && (
                        <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                          {item.ram}
                        </span>
                      )}
                      {item.storage && (
                        <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
                          {item.storage}
                        </span>
                      )}
                    </div>
                    <p className="text-base sm:text-lg md:text-xl font-bold text-blue-600 mt-2 sm:mt-3">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row sm:flex-col gap-2">
                    <button
                      onClick={() => handleBuyNow(item)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                    >
                      <FaBolt size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span className="hidden xs:inline">Buy Now</span>
                      <span className="xs:hidden">Buy</span>
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition flex items-center gap-1 sm:gap-2"
                    >
                      <FiTrash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span className="hidden xs:inline">Remove</span>
                      <span className="xs:hidden">Del</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:flex-1">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 sticky top-24 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 pb-2 border-b">
                  <FiPackage
                    className="text-blue-600"
                    size={18}
                    className="sm:w-5 sm:h-5"
                  />
                  Order Summary
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <div className="flex items-center gap-1">
                      <FiTruck size={12} className="sm:w-3.5 sm:h-3.5" />
                      <span>Shipping</span>
                    </div>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-medium">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  {remainingForFreeShipping > 0 && (
                    <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 sm:gap-2 text-blue-700">
                        <FiTruck size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span className="font-medium">
                          Add {formatPrice(remainingForFreeShipping)} more for
                          free shipping
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-1 mt-1.5 sm:mt-2">
                        <div
                          className="bg-blue-600 h-1 rounded-full transition-all"
                          style={{
                            width: `${Math.min((subtotal / 50000) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-2 sm:pt-3 mt-2 sm:mt-3">
                    <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-xl sm:text-2xl text-blue-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm sm:text-base"
                >
                  Proceed to Checkout
                  <FiArrowRight size={14} className="sm:w-4 sm:h-4" />
                </button>

                <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                  <FiClock size={10} className="sm:w-2.5 sm:h-2.5" />
                  <span>Delivery: 3-5 business days</span>
                </div>

                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      ✅ Secure Checkout
                    </span>
                    <span className="flex items-center gap-1">
                      🚚 Free Shipping Over Rs 50k
                    </span>
                    <span className="flex items-center gap-1">
                      🛡️ 1 Year Warranty
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
