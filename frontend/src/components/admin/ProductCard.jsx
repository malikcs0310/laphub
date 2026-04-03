import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiStar,
  FiCheck,
  FiShoppingCart,
  FiAlertCircle,
  FiLoader,
  FiHeart,
} from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import { addToCart } from "../../utils/cartUtils";
import toast from "react-hot-toast";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
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
      toast.success(
        `✨ ${product.title.split(" ").slice(0, 3).join(" ")}... added to cart!`,
        {
          icon: "🛒",
          duration: 2500,
          style: {
            background: "linear-gradient(135deg, #065f46, #10b981)",
            color: "#fff",
          },
        },
      );
    } else {
      toast.error("❌ Failed to add to cart", {
        icon: "😢",
        duration: 3000,
      });
    }
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();

    if (!isLoggedIn) {
      toast.error("🔒 Please login to continue shopping!", {
        icon: "🔐",
        duration: 3000,
        style: {
          background: "linear-gradient(135deg, #991b1b, #ef4444)",
        },
      });
      setTimeout(() => {
        toast.loading("Taking you to login...", {
          duration: 1000,
        });
        setTimeout(() => {
          navigate("/login", { state: { from: `/product/${product._id}` } });
        }, 1000);
      }, 500);
      return;
    }

    toast.success("🚀 Redirecting to secure checkout...", {
      icon: "💨",
      duration: 1500,
    });
    setTimeout(() => {
      navigate(`/checkout?product=${product._id}`);
    }, 800);
  };

  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("🔒 Please login to add to wishlist", {
        icon: "🔐",
        duration: 2000,
      });
      setTimeout(() => {
        navigate("/login", { state: { from: `/product/${product._id}` } });
      }, 1000);
      return;
    }

    let updatedWishlist;
    if (wishlist.includes(product._id)) {
      updatedWishlist = wishlist.filter((id) => id !== product._id);
      toast.success("💔 Removed from wishlist", {
        icon: "😢",
        duration: 2000,
      });
    } else {
      updatedWishlist = [...wishlist, product._id];
      toast.success("❤️ Added to wishlist", {
        icon: "🎯",
        duration: 2000,
      });
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const url = search
          ? `${API_URL}/api/laptops?search=${encodeURIComponent(search)}`
          : `${API_URL}/api/laptops`;

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          setProducts(data.data || []);
        }
      } catch (error) {
        toast.error("Failed to load products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, API_URL]);

  // Loading Skeleton
  if (loading) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <div className="h-10 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-6 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full"></div>
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3"></div>
                  </div>
                  <div className="h-8 bg-gray-200 animate-pulse rounded w-1/2"></div>
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
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            All Products
          </h2>
          <p className="text-gray-600">
            {search
              ? `Search results for "${search}" (${products.length} products found)`
              : `Explore all available laptops (${products.length} products)`}
          </p>
        </div>

        {/* Cards Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={
                      product.images && product.images.length > 0
                        ? `${API_URL}/uploads/${product.images[0]}`
                        : "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={product.title}
                    className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.condition && (
                      <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-3 py-1 rounded-lg text-xs font-semibold shadow-lg">
                        {product.condition}
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:bg-white transition z-10"
                  >
                    <FiHeart
                      className={`text-xl transition ${
                        wishlist.includes(product._id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                    />
                  </button>

                  {/* Login Overlay on Hover when not logged in */}
                  {!isLoggedIn && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-4 py-2 rounded-lg text-sm font-medium">
                        Login to buy
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-5">
                  {/* Brand & Rating */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded-lg">
                      {product.brand || "Laptop"}
                    </span>
                    <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <FiStar className="text-yellow-400 text-sm" />
                      <span className="text-sm font-medium text-gray-700">
                        {product.rating || "4.8"}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[56px]">
                    {product.title}
                  </h3>

                  {/* Specs */}
                  <div className="mb-4 space-y-1.5">
                    {product.processor && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <FiCheck
                          className="mr-2 text-green-500 flex-shrink-0"
                          size={14}
                        />
                        <span className="line-clamp-1">
                          {product.processor}
                        </span>
                      </div>
                    )}
                    {product.ram && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <FiCheck
                          className="mr-2 text-green-500 flex-shrink-0"
                          size={14}
                        />
                        <span>{product.ram}</span>
                      </div>
                    )}
                    {product.storage && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <FiCheck
                          className="mr-2 text-green-500 flex-shrink-0"
                          size={14}
                        />
                        <span>{product.storage}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-gray-900">
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
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <FaBolt size={14} />
                      Buy Now
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="flex-1 bg-gray-900 hover:bg-black text-white px-3 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <FiShoppingCart size={14} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <FiAlertCircle className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {search
                ? `No laptops found for "${search}". Try a different search term or browse all products.`
                : "No laptops available right now. Please check back later."}
            </p>
            {search && (
              <button
                onClick={() => navigate("/products")}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                View All Products
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductCard;
