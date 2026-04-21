import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiStar,
  FiCheck,
  FiShoppingCart,
  FiAlertCircle,
} from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import { addToCart } from "../../utils/cartUtils";
import { toast } from "react-hot-toast";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
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

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/laptops/featured`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.log("Error fetching featured products:", error);
        toast.error("Failed to load featured products");
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [API_URL]);

  // Loading Skeleton
  if (loading) {
    return (
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12">
            <div>
              <div className="h-7 sm:h-10 w-32 sm:w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 sm:h-6 w-48 sm:w-64 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-8 sm:h-10 w-24 sm:w-32 bg-gray-200 rounded-lg animate-pulse mt-3 sm:mt-0"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="h-28 sm:h-36 md:h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-2 sm:p-3 md:p-5 space-y-1 sm:space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
                  <div className="h-4 sm:h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="space-y-1">
                    <div className="h-2 sm:h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                    <div className="h-2 sm:h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                  </div>
                  <div className="h-5 sm:h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  <div className="flex gap-2 sm:gap-3">
                    <div className="h-7 sm:h-10 bg-gray-200 animate-pulse rounded-lg flex-1"></div>
                    <div className="h-7 sm:h-10 bg-gray-200 animate-pulse rounded-lg flex-1"></div>
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
    <section className="py-8 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-12">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Latest 4 newly added laptops
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base mt-3 sm:mt-0 group"
          >
            View All
            <FiArrowRight className="ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform text-xs sm:text-sm" />
          </Link>
        </div>

        {/* Cards */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group bg-white rounded-xl sm:rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden bg-gray-100 aspect-square">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? `${API_URL}/uploads/${product.images[0]}`
                        : "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-4 md:left-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[8px] sm:text-xs md:text-sm font-semibold shadow-lg">
                    New
                  </div>
                  {!isLoggedIn && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 sm:px-3 sm:py-2 rounded-lg text-[10px] sm:text-sm font-medium">
                        Login to buy
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-2 sm:p-3 md:p-4 lg:p-5">
                  {/* Brand & Rating */}
                  <div className="flex items-center justify-between mb-1 sm:mb-2 md:mb-3">
                    <span className="text-[9px] sm:text-xs md:text-sm text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg">
                      {product.brand || "Laptop"}
                    </span>
                    <div className="flex items-center gap-0.5 sm:gap-1 bg-yellow-50 px-1 py-0.5 sm:px-2 sm:py-1 rounded-lg">
                      <FiStar className="text-yellow-400 text-[8px] sm:text-xs md:text-sm" />
                      <span className="text-[8px] sm:text-xs md:text-sm font-medium text-gray-700">
                        {product.rating || "4.8"}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gray-900 mb-1 line-clamp-2 min-h-[32px] sm:min-h-[40px] md:min-h-[48px]">
                    {product.title.length > 40
                      ? `${product.title.substring(0, 40)}...`
                      : product.title}
                  </h3>

                  {/* Specs - Hide on very small screens */}
                  <div className="hidden sm:block mb-2 md:mb-3 space-y-0.5 md:space-y-1.5">
                    {product.processor && (
                      <div className="flex items-center text-gray-600 text-[10px] sm:text-xs">
                        <FiCheck
                          className="mr-1 text-green-500 flex-shrink-0"
                          size={10}
                        />
                        <span className="line-clamp-1">
                          {product.processor}
                        </span>
                      </div>
                    )}
                    {product.ram && (
                      <div className="flex items-center text-gray-600 text-[10px] sm:text-xs">
                        <FiCheck
                          className="mr-1 text-green-500 flex-shrink-0"
                          size={10}
                        />
                        <span>{product.ram}</span>
                      </div>
                    )}
                    {product.storage && (
                      <div className="flex items-center text-gray-600 text-[10px] sm:text-xs">
                        <FiCheck
                          className="mr-1 text-green-500 flex-shrink-0"
                          size={10}
                        />
                        <span>{product.storage}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                    Rs {product.price?.toLocaleString() || "0"}
                  </div>

                  {/* Buttons - Stacked on mobile, side by side on tablet+ */}
                  <div className="flex flex-col xs:flex-row gap-1 sm:gap-2 md:gap-3">
                    <button
                      onClick={(e) => handleBuyNow(product, e)}
                      className="w-full xs:flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-1.5 py-1.5 sm:px-2 sm:py-2 md:px-3 md:py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm"
                    >
                      <FaBolt
                        size={10}
                        className="sm:w-3 sm:h-3 md:w-4 md:h-4"
                      />
                      <span className="hidden xs:inline">Buy Now</span>
                      <span className="xs:hidden">Buy</span>
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="w-full xs:flex-1 bg-gray-900 hover:bg-black text-white px-1.5 py-1.5 sm:px-2 sm:py-2 md:px-3 md:py-2.5 rounded-lg sm:rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm"
                    >
                      <FiShoppingCart
                        size={10}
                        className="sm:w-3 sm:h-3 md:w-4 md:h-4"
                      />
                      <span className="hidden xs:inline">Add</span>
                      <span className="xs:hidden">+</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8 sm:p-12 text-center">
            <FiAlertCircle className="mx-auto text-gray-400 text-3xl sm:text-5xl mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-xl font-bold text-gray-800 mb-1 sm:mb-2">
              No featured products found
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              Check back soon for our latest laptops!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
