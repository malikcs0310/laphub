import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  FiStar,
  FiCheck,
  FiShoppingCart,
  FiAlertCircle,
  FiHeart,
  FiFilter,
  FiX,
} from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import { addToCart } from "../../utils/cartUtils";
import toast from "react-hot-toast";
import ProductFilters from "./ProductFilters";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [filters, setFilters] = useState({
    brand: [],
    processor: [],
    ram: [],
    storage: [],
    minPrice: 0,
    maxPrice: 200000,
  });

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

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = search
          ? `${API_URL}/api/laptops?search=${encodeURIComponent(search)}`
          : `${API_URL}/api/laptops`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        const productsData = Array.isArray(data) ? data : data.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
      } catch (error) {
        console.log("Error fetching products:", error);
        toast.error("Failed to load products");
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, API_URL]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    if (filters.brand.length > 0) {
      filtered = filtered.filter((p) => filters.brand.includes(p.brand));
    }

    if (filters.processor.length > 0) {
      filtered = filtered.filter((p) => {
        return filters.processor.some((proc) =>
          p.processor?.toLowerCase().includes(proc.toLowerCase()),
        );
      });
    }

    if (filters.ram.length > 0) {
      filtered = filtered.filter((p) => {
        return filters.ram.some((ram) =>
          p.ram?.toLowerCase().includes(ram.toLowerCase()),
        );
      });
    }

    if (filters.storage.length > 0) {
      filtered = filtered.filter((p) => {
        return filters.storage.some((storage) =>
          p.storage?.toLowerCase().includes(storage.toLowerCase()),
        );
      });
    }

    filtered = filtered.filter(
      (p) => p.price >= filters.minPrice && p.price <= filters.maxPrice,
    );

    setFilteredProducts(filtered);
  }, [filters, products]);

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

  const activeFilterCount =
    filters.brand.length +
    filters.processor.length +
    filters.ram.length +
    filters.storage.length;

  // Loading Skeleton
  if (loading) {
    return (
      <section className="py-8 sm:py-16 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="mb-6 sm:mb-12">
            <div className="h-7 sm:h-10 w-32 sm:w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 sm:h-6 w-48 sm:w-64 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 xl:gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-2 sm:p-3 md:p-4 space-y-1 sm:space-y-3">
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
    <section className="py-8 sm:py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2">
              All Products
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600">
              {search
                ? `Search results for "${search}" (${filteredProducts.length} products)`
                : `Explore all available laptops (${filteredProducts.length} products)`}
            </p>
          </div>

          {/* Filter Button for Mobile */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm"
          >
            <FiFilter />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Active Filters Chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.brand.map((b) => (
              <span
                key={b}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {b}
              </span>
            ))}
            {filters.processor.map((p) => (
              <span
                key={p}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {p}
              </span>
            ))}
            {filters.ram.map((r) => (
              <span
                key={r}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {r}
              </span>
            ))}
            {filters.storage.map((s) => (
              <span
                key={s}
                className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
            <button
              onClick={() =>
                setFilters({
                  brand: [],
                  processor: [],
                  ram: [],
                  storage: [],
                  minPrice: 0,
                  maxPrice: 200000,
                })
              }
              className="text-xs text-red-600 hover:text-red-700"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Desktop Layout with Filters Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-72 flex-shrink-0">
            <ProductFilters
              onFilterChange={setFilters}
              initialFilters={filters}
            />
          </div>

          {/* Cards Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                {filteredProducts.map((product) => (
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

                      {/* Badges */}
                      <div className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-3 md:left-3 flex flex-col gap-1 sm:gap-2">
                        {product.condition && (
                          <span className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg text-[8px] sm:text-xs font-semibold shadow-lg">
                            {product.condition}
                          </span>
                        )}
                      </div>

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => toggleWishlist(product, e)}
                        className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-3 md:right-3 bg-white/90 backdrop-blur-sm p-1.5 sm:p-2 rounded-full shadow-md hover:bg-white transition z-10"
                      >
                        <FiHeart
                          className={`text-sm sm:text-base md:text-xl transition ${
                            wishlist.includes(product._id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-500 hover:text-red-500"
                          }`}
                        />
                      </button>

                      {/* Login Overlay */}
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

                      {/* Specs */}
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
                      <div className="mb-2 sm:mb-3 md:mb-4">
                        <span className="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900">
                          Rs {product.price?.toLocaleString() || "0"}
                        </span>
                        {product.originalPrice && (
                          <span className="ml-1 sm:ml-2 text-[8px] sm:text-xs md:text-sm text-gray-400 line-through">
                            Rs {product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>

                      {/* Buttons */}
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
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-3 sm:mb-4">
                  <FiAlertCircle className="text-gray-400 text-2xl sm:text-3xl" />
                </div>
                <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
                  No products found
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-md mx-auto">
                  Try adjusting your filters or search term.
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      brand: [],
                      processor: [],
                      ram: [],
                      storage: [],
                      minPrice: 0,
                      maxPrice: 200000,
                    })
                  }
                  className="mt-4 sm:mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg transition text-sm sm:text-base"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 h-[85vh] bg-white z-50 shadow-xl rounded-t-2xl overflow-y-auto lg:hidden">
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between rounded-t-2xl">
              <h3 className="font-bold text-lg">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiX />
              </button>
            </div>
            <div className="p-4 pb-8">
              <ProductFilters
                onFilterChange={setFilters}
                initialFilters={filters}
              />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
              >
                Apply Filters ({activeFilterCount})
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default ProductCard;
