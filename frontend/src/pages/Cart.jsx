import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiTrash2,
  FiShoppingCart,
  FiAlertCircle,
  FiArrowRight,
  FiTruck,
  FiPackage,
  FiClock,
  FiShield,
  FiHeart,
  FiCpu,
  FiHardDrive,
  FiDatabase,
  FiCheckCircle,
} from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import toast from "react-hot-toast";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Get image URL (supports both local uploads and Cloudinary)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL (Cloudinary), return as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    // Otherwise, it's a local upload
    return `${API_URL}/uploads/${imagePath}`;
  };

  useEffect(() => {
    loadCart();
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const handleCartUpdate = () => loadCart();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
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
    toast.success("Item removed from cart");
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cartItems.map((item) =>
      item._id === id ? { ...item, quantity: newQuantity } : item,
    );
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login to checkout");
      setTimeout(
        () => navigate("/login", { state: { from: "/checkout" } }),
        500,
      );
      return;
    }

    setIsProcessing(true);
    toast.success("Redirecting to secure checkout...");
    setTimeout(() => {
      setIsProcessing(false);
      navigate("/checkout");
    }, 800);
  };

  const handleBuyNow = (product) => {
    if (!isLoggedIn) {
      toast.error("Please login to buy");
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
      existingCart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(existingCart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Product added to cart");
    }
    setTimeout(() => navigate("/checkout"), 800);
  };

  const moveToWishlist = (product) => {
    removeFromCart(product._id);
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (!wishlist.includes(product._id)) {
      wishlist.push(product._id);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      toast.success("Moved to wishlist");
    } else {
      toast.info("Already in wishlist");
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + (Number(item.price) || 0) * (item.quantity || 1),
    0,
  );
  const shipping = subtotal > 50000 ? 0 : 300;
  const total = subtotal + shipping;
  const remainingForFreeShipping = subtotal > 50000 ? 0 : 50000 - subtotal;
  const itemCount = cartItems.reduce(
    (count, item) => count + (item.quantity || 1),
    0,
  );

  const formatPrice = (price) => `Rs ${Number(price).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
            Your Cart
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {cartItems.length === 0
              ? "Your cart is empty"
              : `${itemCount} ${itemCount === 1 ? "item" : "items"} in your cart`}
          </p>
        </div>

        {cartItems.length === 0 ? (
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
            <div className="lg:flex-[2] space-y-3 sm:space-y-4">
              {cartItems.map((item) => {
                const isLowStock = item.stock > 0 && item.stock <= 3;
                const isOutOfStock = item.stock <= 0;

                return (
                  <div
                    key={item._id}
                    className={`bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row gap-4 sm:gap-5 items-center border ${
                      isOutOfStock
                        ? "border-red-200 bg-red-50/30"
                        : "border-gray-100"
                    }`}
                  >
                    <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex-shrink-0 bg-gray-50 rounded-lg sm:rounded-xl overflow-hidden">
                      <img
                        src={
                          item.images && item.images.length > 0
                            ? getImageUrl(item.images[0])
                            : "https://via.placeholder.com/150x150?text=No+Image"
                        }
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/150x150?text=No+Image";
                        }}
                      />
                    </div>

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
                          <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded flex items-center gap-0.5">
                            <FiCpu size={9} />
                            {item.processor.length > 20
                              ? `${item.processor.substring(0, 20)}...`
                              : item.processor}
                          </span>
                        )}
                        {item.generation && (
                          <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {item.generation}
                          </span>
                        )}
                        {item.ram && (
                          <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <FiDatabase size={9} />
                            {item.ram}
                          </span>
                        )}
                        {item.storage && (
                          <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <FiHardDrive size={9} />
                            {item.storage}
                          </span>
                        )}
                      </div>

                      {isLowStock && !isOutOfStock && (
                        <div className="flex items-center gap-1 mt-1.5 justify-center sm:justify-start">
                          <FiAlertCircle
                            size={10}
                            className="text-orange-500"
                          />
                          <span className="text-[9px] text-orange-600 font-medium">
                            Only {item.stock} left in stock
                          </span>
                        </div>
                      )}
                      {isOutOfStock && (
                        <div className="flex items-center gap-1 mt-1.5 justify-center sm:justify-start">
                          <FiAlertCircle size={10} className="text-red-500" />
                          <span className="text-[9px] text-red-600 font-medium">
                            Out of stock
                          </span>
                        </div>
                      )}

                      <p className="text-base sm:text-lg md:text-xl font-bold text-blue-600 mt-2 sm:mt-3">
                        {formatPrice(item.price)}
                        {item.quantity && item.quantity > 1 && (
                          <span className="text-xs text-gray-400 ml-1">
                            × {item.quantity}
                          </span>
                        )}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          updateQuantity(item._id, (item.quantity || 1) - 1)
                        }
                        className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-gray-900">
                        {item.quantity || 1}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item._id, (item.quantity || 1) + 1)
                        }
                        disabled={item.stock <= (item.quantity || 1)}
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg font-medium transition ${
                          item.stock > (item.quantity || 1)
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        +
                      </button>
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2">
                      <button
                        onClick={() => moveToWishlist(item)}
                        disabled={isOutOfStock}
                        className="bg-pink-50 hover:bg-pink-100 text-pink-600 px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition flex items-center gap-1 disabled:opacity-50"
                      >
                        <FiHeart size={12} />
                        <span className="hidden sm:inline">Save</span>
                      </button>
                      <button
                        onClick={() => handleBuyNow(item)}
                        disabled={isOutOfStock}
                        className={`px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition flex items-center gap-1 ${
                          isOutOfStock
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                        }`}
                      >
                        <FaBolt size={12} />
                        <span className="hidden xs:inline">Buy Now</span>
                        <span className="xs:hidden">Buy</span>
                      </button>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition flex items-center gap-1"
                      >
                        <FiTrash2 size={12} />
                        <span className="hidden xs:inline">Remove</span>
                        <span className="xs:hidden">Del</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="lg:flex-1">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 sticky top-24 border border-gray-100">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 pb-2 border-b">
                  <FiPackage className="text-blue-600" size={18} />
                  Order Summary
                </h2>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <span>
                      Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}
                      )
                    </span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                    <div className="flex items-center gap-1">
                      <FiTruck size={12} />
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
                      <div className="flex items-center gap-1.5 text-blue-700">
                        <FiTruck size={12} />
                        <span className="font-medium">
                          Add {formatPrice(remainingForFreeShipping)} more for
                          free shipping
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-1 mt-1.5">
                        <div
                          className="bg-blue-600 h-1 rounded-full transition-all"
                          style={{
                            width: `${Math.min((subtotal / 50000) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between text-base lg:text-lg font-bold text-gray-900">
                      <span>Total</span>
                      <span className="text-xl lg:text-2xl text-blue-600">
                        {formatPrice(total)}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <p className="text-[10px] text-gray-400 mt-1 text-right">
                        Including shipping
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={
                    isProcessing || cartItems.some((item) => item.stock <= 0)
                  }
                  className={`w-full mt-4 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
                    isProcessing || cartItems.some((item) => item.stock <= 0)
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  {isProcessing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      Proceed to Checkout
                      <FiArrowRight size={14} />
                    </>
                  )}
                </button>

                <div className="mt-4 pt-3 border-t">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center">
                      <FiShield className="text-green-600 text-sm" />
                      <span className="text-[9px] text-gray-500 mt-0.5">
                        Secure
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <FiTruck className="text-blue-600 text-sm" />
                      <span className="text-[9px] text-gray-500 mt-0.5">
                        Fast Delivery
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <FiCheckCircle className="text-purple-600 text-sm" />
                      <span className="text-[9px] text-gray-500 mt-0.5">
                        Warranty
                      </span>
                    </div>
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
