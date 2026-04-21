import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiShoppingCart, FiTrash2, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(savedWishlist);
    fetchWishlistProducts(savedWishlist);
  }, []);

  const fetchWishlistProducts = async (ids) => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/laptops`);
      const data = await response.json();
      const allProducts = Array.isArray(data) ? data : data.data || [];
      const wishlistProducts = allProducts.filter((p) => ids.includes(p._id));
      setProducts(wishlistProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(updatedWishlist);
    setProducts(products.filter((p) => p._id !== productId));
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    toast.success("Removed from wishlist");
  };

  const addToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.some((item) => item._id === product._id);
    if (!exists) {
      cart.push(product);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success("Added to cart");
    } else {
      toast.error("Already in cart");
    }
  };

  const formatPrice = (price) => `Rs ${Number(price).toLocaleString()}`;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        My Wishlist
      </h1>

      {products.length === 0 ? (
        // Empty State - Mobile Optimized
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-8 sm:p-12 text-center">
          <FiHeart className="mx-auto text-gray-400 text-4xl sm:text-5xl mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 text-sm sm:text-base mb-5 sm:mb-6">
            Save your favorite items here
          </p>
          <Link
            to="/products"
            className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 sm:px-6 sm:py-2 rounded-lg transition text-sm sm:text-base"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        // Wishlist Grid - Mobile Optimized
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <Link to={`/product/${product._id}`}>
                <div className="relative aspect-[4/3] bg-gray-100">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? `${API_URL}/uploads/${product.images[0]}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Link>
              <div className="p-3 sm:p-4">
                {/* Title */}
                <Link to={`/product/${product._id}`}>
                  <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 sm:mb-2 text-sm sm:text-base">
                    {product.title.length > 50
                      ? `${product.title.substring(0, 50)}...`
                      : product.title}
                  </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                  <FiStar className="text-yellow-400 fill-yellow-400 text-xs sm:text-sm" />
                  <span className="text-xs sm:text-sm text-gray-600">4.8</span>
                </div>

                {/* Price */}
                <p className="text-base sm:text-xl font-bold text-blue-600 mb-3 sm:mb-4">
                  {formatPrice(product.price)}
                </p>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <FiShoppingCart size={12} className="sm:w-3.5 sm:h-3.5" />
                    <span className="hidden xs:inline">Add to Cart</span>
                    <span className="xs:hidden">Add</span>
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product._id)}
                    className="p-1.5 sm:p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
                  >
                    <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserWishlist;
