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

    toast.success("🗑️ Item removed from cart", {
      icon: "✨",
      duration: 2000,
    });
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty", {
        icon: "🛒",
        duration: 2000,
      });
      return;
    }

    if (!isLoggedIn) {
      toast.error("🔒 Please login to checkout", {
        icon: "🔐",
        duration: 3000,
        style: {
          background: "linear-gradient(135deg, #991b1b, #ef4444)",
        },
      });
      setTimeout(() => {
        navigate("/login", { state: { from: "/checkout" } });
      }, 500);
      return;
    }

    toast.success("🚀 Redirecting to secure checkout...", {
      icon: "💨",
      duration: 1500,
    });
    setTimeout(() => {
      navigate("/checkout");
    }, 800);
  };

  const handleBuyNow = (product) => {
    if (!isLoggedIn) {
      toast.error("🔒 Please login to buy", {
        icon: "🔐",
        duration: 2000,
      });
      setTimeout(() => {
        navigate("/login", { state: { from: `/product/${product._id}` } });
      }, 500);
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const exists = existingCart.some((item) => item._id === product._id);

    if (!exists) {
      existingCart.push(product);
      localStorage.setItem("cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("✨ Product added to cart", {
        icon: "🛒",
        duration: 1500,
      });
    }

    setTimeout(() => {
      navigate("/checkout");
    }, 800);
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + (Number(item.price) || 0),
    0,
  );
  const shipping = subtotal > 50000 ? 0 : 300;
  const total = subtotal + shipping;
  const remainingForFreeShipping = subtotal > 50000 ? 0 : 50000 - subtotal;

  const formatPrice = (price) => {
    return `Rs ${Number(price).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Cart
          </h1>
          <p className="text-gray-600">
            {cartItems.length === 0
              ? "Your cart is empty"
              : `${cartItems.length} ${cartItems.length === 1 ? "item" : "items"} in your cart`}
          </p>
        </div>

        {cartItems.length === 0 ? (
          // Empty Cart State
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
              <FiShoppingCart className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Continue Shopping
              <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all p-5 flex flex-col sm:flex-row gap-5 items-center border border-gray-100"
                >
                  <div className="w-28 h-28 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden">
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

                  <div className="flex-1 w-full">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-bold text-gray-900 hover:text-blue-600 transition line-clamp-2"
                    >
                      {item.title}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.brand} {item.model}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {item.processor && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {item.processor}
                        </span>
                      )}
                      {item.ram && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {item.ram}
                        </span>
                      )}
                      {item.storage && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {item.storage}
                        </span>
                      )}
                    </div>
                    <p className="text-xl font-bold text-blue-600 mt-3">
                      {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleBuyNow(item)}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 rounded-xl font-medium text-sm transition flex items-center gap-2 whitespace-nowrap shadow-sm hover:shadow"
                    >
                      <FaBolt size={14} />
                      Buy Now
                    </button>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium text-sm transition flex items-center gap-2"
                    >
                      <FiTrash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24 border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2 pb-2 border-b">
                  <FiPackage className="text-blue-600" />
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiTruck size={14} />
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
                    <div className="bg-blue-50 rounded-xl p-3 text-sm">
                      <div className="flex items-center gap-2 text-blue-700">
                        <FiTruck size={14} />
                        <span className="font-medium">
                          Add {formatPrice(remainingForFreeShipping)} more to
                          get free shipping
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${Math.min((subtotal / 50000) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-2xl text-blue-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                  <FiArrowRight size={18} />
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FiClock size={12} />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-center gap-4 text-xs text-gray-500">
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
