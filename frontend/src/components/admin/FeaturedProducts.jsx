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

  // Check login status
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Load wishlist
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

  // Fetch ratings for products
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

  // Loading Skeleton
  if (loading) {
    return (
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div>
              <div className="h-7 sm:h-10 w-32 sm:w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 sm:h-6 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-8 sm:h-10 w-24 bg-gray-200 rounded-lg animate-pulse mt-3 sm:mt-0"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden border border-gray-100"
              >
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-2 space-y-2">
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/3"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-7 bg-gray-200 animate-pulse rounded flex-1"></div>
                    <div className="h-7 bg-gray-200 animate-pulse rounded flex-1"></div>
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
    <section className="py-6 sm:py-8 bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6">
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Latest 4 newly added laptops
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm mt-3 sm:mt-0 group"
          >
            View All
            <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform text-xs" />
          </Link>
        </div>

        {/* Cards - Same CSS as ProductCard */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {products.map((product) => {
              const rating = productRatings[product._id] || {
                average: 0,
                total: 0,
              };
              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? `${API_URL}/uploads/${product.images[0]}`
                          : "https://via.placeholder.com/300x300?text=No+Image"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Condition Badge */}
                    {product.condition && (
                      <span className="absolute top-1 left-1 bg-blue-600 text-white px-1.5 py-0.5 rounded text-[9px] font-semibold">
                        {product.condition}
                      </span>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm"
                    >
                      <FiHeart
                        size={14}
                        className={`transition ${
                          wishlist.includes(product._id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-500"
                        }`}
                      />
                    </button>

                    {/* Login Overlay */}
                    {!isLoggedIn && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-2 py-1 rounded text-[9px] font-medium">
                          Login to buy
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-2">
                    {/* Brand */}
                    <div className="mb-1">
                      <span className="text-[9px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                        {product.brand || "Laptop"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[11px] font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[26px]">
                      {product.title.length > 45
                        ? `${product.title.substring(0, 45)}...`
                        : product.title}
                    </h3>

                    {/* Specs */}
                    <div className="space-y-0.5 mb-1">
                      {product.processor && (
                        <div className="flex items-center gap-1 text-[8px] text-gray-500">
                          <FiCpu size={8} />
                          <span className="line-clamp-1">
                            {product.processor}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        {product.ram && (
                          <div className="flex items-center gap-1 text-[8px] text-gray-500">
                            <FiDatabase size={8} />
                            <span>{product.ram}</span>
                          </div>
                        )}
                        {product.storage && (
                          <div className="flex items-center gap-1 text-[8px] text-gray-500">
                            <FiHardDrive size={8} />
                            <span>{product.storage}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-1.5">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            size={8}
                            className={`${
                              star <= Math.round(rating.average)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {rating.total > 0 && (
                        <span className="text-[7px] text-gray-400">
                          ({rating.total})
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-2">
                      <span className="text-xs font-bold text-gray-900">
                        Rs {product.price?.toLocaleString() || "0"}
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => handleBuyNow(product, e)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-medium py-1 rounded transition"
                      >
                        Buy Now
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-[9px] font-medium py-1 rounded transition flex items-center justify-center gap-0.5"
                      >
                        <FiShoppingCart size={8} />
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FiAlertCircle className="mx-auto text-gray-400 text-3xl mb-3" />
            <h3 className="text-base font-bold text-gray-800 mb-1">
              No featured products found
            </h3>
            <p className="text-xs text-gray-500">
              Check back soon for our latest laptops!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
