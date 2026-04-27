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
    if (!isLoggedIn) {
      toast.error("Please login or signup to continue");
      setTimeout(() => {
        navigate("/login", { state: { from: `/product/${product._id}` } });
      }, 1000);
      return;
    }
    navigate(`/checkout?product=${product._id}`);
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

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/laptops/featured`);
        const data = await res.json();
        const productsData = Array.isArray(data) ? data : data.data || [];
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
        {/* Header */}
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

        {/* Products Grid - 2 columns on mobile, 4 on desktop */}
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
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                {/* Image - Fixed height for mobile */}
                <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden bg-gray-100">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? `${API_URL}/uploads/${product.images[0]}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />

                  {/* Condition Badge */}
                  {product.condition && (
                    <span className="absolute top-1 left-1 bg-blue-600 text-white text-[8px] sm:text-xs px-1.5 py-0.5 rounded">
                      {product.condition}
                    </span>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm"
                  >
                    <FiHeart
                      size={12}
                      className={
                        wishlist.includes(product._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-500"
                      }
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-2">
                  {/* Brand */}
                  <div className="mb-1">
                    <span className="text-[8px] sm:text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                      {product.brand || "Laptop"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-[10px] sm:text-xs font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[28px] sm:min-h-[32px]">
                    {product.title.length > 40
                      ? `${product.title.substring(0, 40)}...`
                      : product.title}
                  </h3>

                  {/* Processor - Small screens hide */}
                  {product.processor && (
                    <div className="hidden sm:flex items-center gap-1 mb-1 text-[8px] text-gray-500">
                      <FiCpu size={9} />
                      <span className="truncate">{product.processor}</span>
                    </div>
                  )}

                  {/* RAM and Storage */}
                  <div className="flex items-center gap-1 sm:gap-2 mb-1">
                    {product.ram && (
                      <div className="flex items-center gap-0.5 text-[7px] sm:text-[9px] text-gray-500">
                        <FiDatabase size={7} />
                        <span>{product.ram}</span>
                      </div>
                    )}
                    {product.storage && (
                      <div className="flex items-center gap-0.5 text-[7px] sm:text-[9px] text-gray-500">
                        <FiHardDrive size={7} />
                        <span>{product.storage}</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-0.5 mb-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FiStar
                          key={star}
                          size={8}
                          className={
                            star <= Math.round(rating.average)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    {rating.total > 0 && (
                      <span className="text-[6px] sm:text-[8px] text-gray-400">
                        ({rating.total})
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-1.5">
                    <span className="text-xs sm:text-sm font-bold text-gray-900">
                      Rs {product.price?.toLocaleString()}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => handleBuyNow(product, e)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[8px] sm:text-[10px] font-medium py-1 rounded transition"
                    >
                      Buy
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 text-[8px] sm:text-[10px] font-medium py-1 rounded transition flex items-center justify-center gap-0.5"
                    >
                      <FiShoppingCart size={8} /> Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
