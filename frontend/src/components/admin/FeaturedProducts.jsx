import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiStar,
  FiShoppingCart,
  FiAlertCircle,
  FiCpu,
  FiHardDrive,
  FiDatabase,
  FiHeart,
} from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import { addToCart } from "../../utils/cartUtils";
import { toast } from "react-hot-toast";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productRatings, setProductRatings] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const result = addToCart(product);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();

    if (!product || !product._id) {
      toast.error("Product not found");
      return;
    }

    if (!isLoggedIn) {
      toast.error("🔒 Please login to continue shopping!");
      setTimeout(() => {
        navigate("/login", { state: { from: `/product/${product._id}` } });
      }, 1000);
      return;
    }

    // Add to cart first
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const exists = cart.some((item) => item._id === product._id);
    if (!exists) {
      cart.push({ ...product, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
    }

    toast.success("🚀 Redirecting to secure checkout...");
    setTimeout(() => {
      navigate("/checkout");
    }, 800);
  };

  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to add to wishlist");
      return;
    }
    let updatedWishlist;
    if (wishlist.includes(product._id)) {
      updatedWishlist = wishlist.filter((id) => id !== product._id);
      toast.success("Removed from wishlist");
    } else {
      updatedWishlist = [...wishlist, product._id];
      toast.success("Added to wishlist");
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

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

  const getImageUrl = (product) => {
    if (!product?.images || product.images.length === 0) {
      return "https://via.placeholder.com/300x200?text=No+Image";
    }
    return product.images[0];
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/laptops/featured`);
        const data = await res.json();
        console.log("API Response:", data);

        let productsData = [];
        if (data.laptops && Array.isArray(data.laptops)) {
          productsData = data.laptops;
        } else if (Array.isArray(data)) {
          productsData = data;
        } else if (data.data && Array.isArray(data.data)) {
          productsData = data.data;
        }

        console.log("Products data:", productsData);
        setProducts(productsData);

        if (productsData.length > 0) {
          await fetchRatings(productsData);
        }
      } catch (error) {
        console.log("Error fetching featured products:", error);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, [API_URL]);

  if (loading) {
    return (
      <section className="py-6 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-1"></div>
              <div className="h-3 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden shadow-sm"
              >
                <div className="h-32 bg-gray-200 animate-pulse"></div>
                <div className="p-2 space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex gap-1">
                    <div className="h-6 bg-gray-200 rounded flex-1"></div>
                    <div className="h-6 bg-gray-200 rounded flex-1"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 bg-gray-50">
      <div className="container mx-auto px-3">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-[10px] sm:text-xs text-gray-500">
              Latest handpicked laptops for you
            </p>
          </div>
          <Link
            to="/products"
            className="text-blue-600 text-xs sm:text-sm font-medium flex items-center gap-0.5"
          >
            View All <FiArrowRight size={12} />
          </Link>
        </div>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {products.map((product) => {
              const rating = productRatings[product._id] || {
                average: 0,
                total: 0,
              };
              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
                >
                  {/* IMAGE */}
                  <div className="relative h-40 sm:h-44 md:h-52 bg-gray-100 overflow-hidden">
                    <img
                      src={getImageUrl(product)}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />

                    {/* BADGES */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      {product.condition && (
                        <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                          {product.condition}
                        </span>
                      )}
                      {product.featured && (
                        <span className="bg-yellow-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>

                    {/* WISHLIST */}
                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      className="absolute top-2 right-2 bg-white p-2 rounded-full shadow hover:scale-110 transition"
                    >
                      <FiHeart
                        size={14}
                        className={
                          wishlist.includes(product._id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-500"
                        }
                      />
                    </button>

                    {/* OUT OF STOCK */}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="bg-red-600 text-white text-xs font-semibold px-3 py-1 rounded">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-3 sm:p-4">
                    {/* BRAND */}
                    <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {product.brand || "Laptop"}
                    </span>

                    {/* TITLE */}
                    <h3 className="mt-2 text-sm sm:text-base font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[44px]">
                      {product.title.length > 60
                        ? `${product.title.substring(0, 60)}...`
                        : product.title}
                    </h3>

                    {/* SPECS */}
                    <div className="mt-2 space-y-1 text-xs sm:text-sm text-gray-600">
                      {product.processor && (
                        <div className="flex items-center gap-2">
                          <FiCpu size={14} />
                          <span>{product.processor}</span>
                        </div>
                      )}

                      <div className="flex gap-4">
                        {product.ram && (
                          <div className="flex items-center gap-1">
                            <FiDatabase size={12} />
                            <span>{product.ram}</span>
                          </div>
                        )}
                        {product.storage && (
                          <div className="flex items-center gap-1">
                            <FiHardDrive size={12} />
                            <span>{product.storage}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* RATING */}
                    <div className="flex items-center gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={14}
                          className={
                            star <= Math.round(rating.average)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                      {rating.total > 0 && (
                        <span className="text-xs text-gray-400 ml-1">
                          ({rating.total})
                        </span>
                      )}
                    </div>

                    {/* PRICE */}
                    <div className="mt-3">
                      <span className="text-base sm:text-lg font-bold text-gray-900">
                        Rs {product.price?.toLocaleString()}
                      </span>

                      {product.stock > 0 && product.stock <= 3 && (
                        <p className="text-xs text-orange-500 mt-1 font-medium">
                          Only {product.stock} left
                        </p>
                      )}
                    </div>

                    {/* BUTTONS */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <button
                        onClick={(e) => handleBuyNow(product, e)}
                        disabled={product.stock <= 0}
                        className={`py-2 rounded-lg text-sm font-semibold transition ${
                          product.stock > 0
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Buy Now
                      </button>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.stock <= 0}
                        className={`py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-2 ${
                          product.stock > 0
                            ? "bg-gray-900 hover:bg-black text-white"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <FiShoppingCart size={14} />
                        Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg">
            <p className="text-gray-500">No featured products available</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
