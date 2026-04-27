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
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <div>
              <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="h-4 w-56 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
            <div className="h-10 w-24 bg-gray-200 rounded-lg animate-pulse mt-3 sm:mt-0"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm"
              >
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  <div className="flex gap-3">
                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg flex-1"></div>
                    <div className="h-10 bg-gray-200 animate-pulse rounded-lg flex-1"></div>
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
    <section className="py-8 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Featured Products
            </h2>
            <p className="text-sm text-gray-500">
              Discover our handpicked selection of premium laptops
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-4 sm:mt-0 text-blue-600 hover:text-blue-700 font-semibold group"
          >
            View All Products
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid - Desktop Professional */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              const rating = productRatings[product._id] || {
                average: 0,
                total: 0,
              };
              return (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer hover:-translate-y-1"
                >
                  {/* Image Section */}
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? `${API_URL}/uploads/${product.images[0]}`
                          : "https://via.placeholder.com/400x400?text=No+Image"
                      }
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-lg">
                        Featured
                      </span>
                    </div>

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => toggleWishlist(product, e)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition"
                    >
                      <FiHeart
                        className={`text-lg transition ${
                          wishlist.includes(product._id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-600 hover:text-red-500"
                        }`}
                      />
                    </button>

                    {/* Login Overlay */}
                    {!isLoggedIn && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-2 rounded-lg text-sm font-medium">
                          Login to purchase
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content Section */}
                  <div className="p-4">
                    {/* Brand */}
                    <div className="mb-2">
                      <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-lg">
                        {product.brand || "Laptop"}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 min-h-[40px]">
                      {product.title.length > 60
                        ? `${product.title.substring(0, 60)}...`
                        : product.title}
                    </h3>

                    {/* Specs - Desktop Visible */}
                    <div className="hidden sm:block space-y-1.5 mb-3">
                      {product.processor && (
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <FiCpu size={14} className="text-gray-400" />
                          <span>{product.processor}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        {product.ram && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <FiDatabase size={14} className="text-gray-400" />
                            <span>{product.ram}</span>
                          </div>
                        )}
                        {product.storage && (
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <FiHardDrive size={14} className="text-gray-400" />
                            <span>{product.storage}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <FiStar
                            key={star}
                            size={14}
                            className={`${
                              star <= Math.round(rating.average)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      {rating.total > 0 && (
                        <span className="text-xs text-gray-500">
                          ({rating.total} reviews)
                        </span>
                      )}
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="text-xl font-bold text-gray-900">
                        Rs {product.price?.toLocaleString() || "0"}
                      </span>
                      {product.originalPrice && (
                        <span className="ml-2 text-sm text-gray-400 line-through">
                          Rs {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => handleBuyNow(product, e)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FaBolt size={14} />
                        Buy Now
                      </button>
                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="flex-1 bg-gray-900 hover:bg-black text-white py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <FiShoppingCart size={14} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <FiAlertCircle className="mx-auto text-gray-400 text-5xl mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No featured products found
            </h3>
            <p className="text-gray-500">
              Check back soon for our latest laptops!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
