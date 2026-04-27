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
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-4 w-56 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden shadow-sm"
              >
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex gap-3">
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
                    <div className="h-10 bg-gray-200 rounded flex-1"></div>
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
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Latest handpicked laptops for you
            </p>
          </div>
          <Link
            to="/products"
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
          >
            View All <FiArrowRight size={16} />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => {
            const rating = productRatings[product._id] || {
              average: 0,
              total: 0,
            };
            return (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? `${API_URL}/uploads/${product.images[0]}`
                        : "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    loading="lazy"
                  />

                  {/* Badge */}
                  {product.condition && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      {product.condition}
                    </span>
                  )}

                  {/* Wishlist */}
                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm"
                  >
                    <FiHeart
                      size={16}
                      className={
                        wishlist.includes(product._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-500"
                      }
                    />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Brand */}
                  <div className="mb-2">
                    <span className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded inline-block">
                      {product.brand || "Laptop"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2 min-h-[40px]">
                    {product.title}
                  </h3>

                  {/* Processor - Full display */}
                  {product.processor && (
                    <div className="flex items-center gap-1 mb-2 text-xs text-gray-600">
                      <FiCpu size={12} className="text-gray-400" />
                      <span>{product.processor}</span>
                    </div>
                  )}

                  {/* RAM and Storage - Side by side */}
                  <div className="flex items-center gap-3 mb-3">
                    {product.ram && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <FiDatabase size={12} className="text-gray-400" />
                        <span>{product.ram}</span>
                      </div>
                    )}
                    {product.storage && (
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <FiHardDrive size={12} className="text-gray-400" />
                        <span>{product.storage}</span>
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
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
                    </div>
                    {rating.total > 0 && (
                      <span className="text-xs text-gray-400">
                        ({rating.total})
                      </span>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      Rs {product.price?.toLocaleString()}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleBuyNow(product, e)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-1"
                    >
                      <FiShoppingCart size={14} /> Add
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
