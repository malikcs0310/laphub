import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiHeart,
  FiShoppingCart,
  FiTrash2,
  FiStar,
  FiCpu,
  FiHardDrive,
  FiDatabase,
  FiAlertCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const UserWishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [productRatings, setProductRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Get image URL (supports both local uploads and Cloudinary)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${API_URL}/uploads/${imagePath}`;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(savedWishlist);
    fetchWishlistProducts(savedWishlist);
  }, []);

  const fetchRatings = async (productsList) => {
    const ratingsMap = {};
    for (const product of productsList) {
      try {
        const res = await fetch(
          `${API_URL}/api/reviews/product/${product._id}/summary`,
        );
        if (res.ok) {
          const data = await res.json();
          ratingsMap[product._id] = {
            average: data.average || 0,
            total: data.total || 0,
          };
        }
      } catch (error) {
        console.log("Rating fetch failed for product:", product._id);
      }
    }
    setProductRatings(ratingsMap);
  };

  const fetchWishlistProducts = async (ids) => {
    if (ids.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/laptops`);
      const data = await response.json();
      const allProducts = Array.isArray(data)
        ? data
        : data.laptops || data.data || [];
      const wishlistProducts = allProducts.filter((p) => ids.includes(p._id));
      setProducts(wishlistProducts);

      if (wishlistProducts.length > 0) {
        await fetchRatings(wishlistProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load wishlist products");
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

  const moveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
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
    <div className="px-2 sm:px-0 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            My Wishlist
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {products.length} {products.length === 1 ? "item" : "items"} saved
          </p>
        </div>
        {!isLoggedIn && (
          <Link
            to="/login"
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Login to save wishlist permanently
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-8 sm:p-12 text-center">
          <FiHeart className="mx-auto text-gray-400 text-4xl sm:text-5xl mb-3" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 text-sm mb-5">
            Save your favorite items here
          </p>
          <Link
            to="/products"
            className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition text-sm"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {products.map((product) => {
            const rating = productRatings[product._id] || {
              average: 0,
              total: 0,
            };
            const isLowStock = product.stock > 0 && product.stock <= 3;
            const isOutOfStock = product.stock <= 0;

            return (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition border border-gray-100"
              >
                <Link to={`/product/${product._id}`}>
                  <div className="relative aspect-[4/3] bg-gray-100">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? getImageUrl(product.images[0])
                          : "https://via.placeholder.com/300x200?text=No+Image"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />

                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    {isLowStock && !isOutOfStock && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-[9px] px-1.5 py-0.5 rounded">
                        Only {product.stock} left
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[9px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                      {product.brand || "Laptop"}
                    </span>
                    {product.condition && (
                      <span className="text-[8px] text-gray-500">
                        {product.condition}
                      </span>
                    )}
                  </div>

                  <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 min-h-[40px]">
                      {product.title.length > 50
                        ? `${product.title.substring(0, 50)}...`
                        : product.title}
                    </h3>
                  </Link>

                  <div className="space-y-0.5 mb-2">
                    {product.processor && (
                      <div className="flex items-center gap-1 text-[9px] text-gray-500">
                        <FiCpu size={8} />
                        <span>{product.processor.substring(0, 30)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {product.ram && (
                        <div className="flex items-center gap-1 text-[8px] text-gray-500">
                          <FiDatabase size={7} />
                          <span>{product.ram}</span>
                        </div>
                      )}
                      {product.storage && (
                        <div className="flex items-center gap-1 text-[8px] text-gray-500">
                          <FiHardDrive size={7} />
                          <span>{product.storage}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={9}
                          className={`${
                            star <= Math.round(rating.average)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {rating.total > 0 && (
                      <span className="text-[8px] text-gray-400">
                        ({rating.total})
                      </span>
                    )}
                  </div>

                  <div className="mb-3">
                    <span className="text-base font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </span>
                    {product.originalPrice && (
                      <span className="ml-1 text-[9px] text-gray-400 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => moveToCart(product)}
                      disabled={isOutOfStock}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition ${
                        isOutOfStock
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white"
                      }`}
                    >
                      <FiShoppingCart size={11} />
                      {isOutOfStock ? "Out of Stock" : "Move to Cart"}
                    </button>
                    <button
                      onClick={() => removeFromWishlist(product._id)}
                      className="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition"
                      title="Remove from wishlist"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserWishlist;
