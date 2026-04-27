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
  FiCpu,
  FiHardDrive,
  FiDatabase,
} from "react-icons/fi";
import { FaBolt } from "react-icons/fa";
import { addToCart } from "../../utils/cartUtils";
import toast from "react-hot-toast";
import ProductFilters from "../ProductFilters";

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [productRatings, setProductRatings] = useState({});
  const [filters, setFilters] = useState({
    brand: [],
    processor: [],
    generation: [],
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
        const productsData = Array.isArray(data)
          ? data
          : data.laptops || data.data || [];
        setProducts(productsData);
        setFilteredProducts(productsData);
        await fetchRatings(productsData);
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

  // Fetch ratings for all products
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

  // Apply filters
  useEffect(() => {
    let filtered = [...products];

    if (filters.brand.length > 0) {
      filtered = filtered.filter((p) => filters.brand.includes(p.brand));
    }

    if (filters.processor.length > 0) {
      filtered = filtered.filter((p) => {
        if (!p.processor) return false;
        const processorLower = p.processor.toLowerCase();
        return filters.processor.some((proc) => {
          const procLower = proc.toLowerCase();
          return processorLower.includes(procLower);
        });
      });
    }

    if (filters.generation?.length > 0) {
      filtered = filtered.filter((p) => {
        if (!p.generation) return false;
        return filters.generation.some((gen) =>
          p.generation?.toLowerCase().includes(gen.toLowerCase()),
        );
      });
    }

    if (filters.ram.length > 0) {
      filtered = filtered.filter((p) => {
        if (!p.ram) return false;
        const ramMatch = p.ram.match(/(\d+)/);
        const productRam = ramMatch ? parseInt(ramMatch[1]) : 0;
        return filters.ram.some((ram) => {
          const filterRam = parseInt(ram);
          return productRam === filterRam;
        });
      });
    }

    if (filters.storage.length > 0) {
      filtered = filtered.filter((p) => {
        if (!p.storage) return false;
        const productMatch = p.storage.match(/(\d+)/);
        if (!productMatch) return false;
        let productSize = parseInt(productMatch[1]);
        if (p.storage.toLowerCase().includes("tb")) {
          productSize = productSize * 1000;
        }
        return filters.storage.some((selectedStorage) => {
          const selectedMatch = selectedStorage.match(/(\d+)/);
          if (!selectedMatch) return false;
          let selectedSize = parseInt(selectedMatch[1]);
          if (selectedStorage.toLowerCase().includes("tb")) {
            selectedSize = selectedSize * 1000;
          }
          return productSize === selectedSize;
        });
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
      );
    } else {
      toast.error("❌ Failed to add to cart");
    }
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("🔒 Please login to continue shopping!");
      setTimeout(() => {
        navigate("/login", { state: { from: `/product/${product._id}` } });
      }, 1000);
      return;
    }
    toast.success("🚀 Redirecting to secure checkout...");
    setTimeout(() => {
      navigate(`/checkout?product=${product._id}`);
    }, 800);
  };

  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("🔒 Please login to add to wishlist");
      setTimeout(() => {
        navigate("/login", { state: { from: `/product/${product._id}` } });
      }, 1000);
      return;
    }
    let updatedWishlist;
    if (wishlist.includes(product._id)) {
      updatedWishlist = wishlist.filter((id) => id !== product._id);
      toast.success("💔 Removed from wishlist");
    } else {
      updatedWishlist = [...wishlist, product._id];
      toast.success("❤️ Added to wishlist");
    }
    setWishlist(updatedWishlist);
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
  };

  const activeFilterCount =
    filters.brand.length +
    (filters.processor?.length || 0) +
    (filters.generation?.length || 0) +
    filters.ram.length +
    filters.storage.length;

  // Get image URL (supports both local uploads and Cloudinary)
  const getImageUrl = (product) => {
    if (!product.images || product.images.length === 0) {
      return "https://via.placeholder.com/300x300?text=No+Image";
    }
    const image = product.images[0];
    // If it's already a full URL (Cloudinary), return as is
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return image;
    }
    // Otherwise, it's a local upload
    return `${API_URL}/uploads/${image}`;
  };

  // Loading Skeleton
  if (loading) {
    return (
      <section className="py-8 bg-gray-50 min-h-screen">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg overflow-hidden border border-gray-100"
              >
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-2 space-y-2">
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
                  <div className="h-5 bg-gray-200 animate-pulse rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 animate-pulse rounded flex-1"></div>
                    <div className="h-8 bg-gray-200 animate-pulse rounded flex-1"></div>
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
    <section className="py-6 sm:py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex justify-between items-center flex-wrap gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              All Laptops
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              {search
                ? `Search results for "${search}" (${filteredProducts.length} products)`
                : `${filteredProducts.length} products found`}
            </p>
          </div>

          {/* Filter Button for Mobile */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border rounded-lg text-sm"
          >
            <FiFilter size={14} />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Layout with Filters Sidebar */}
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <ProductFilters
              onFilterChange={setFilters}
              initialFilters={filters}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                {filteredProducts.map((product) => {
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
                          src={getImageUrl(product)}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x300?text=No+Image";
                          }}
                        />

                        {/* Badges */}
                        <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                          {product.condition && (
                            <span className="bg-blue-600 text-white px-1.5 py-0.5 rounded text-[9px] font-semibold">
                              {product.condition}
                            </span>
                          )}
                          {product.featured && (
                            <span className="bg-yellow-500 text-white px-1.5 py-0.5 rounded text-[9px] font-semibold">
                              Featured
                            </span>
                          )}
                        </div>

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

                        {/* Stock Badge */}
                        {product.stock <= 0 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-2 sm:p-2.5">
                        {/* Brand */}
                        <div className="mb-1">
                          <span className="text-[10px] text-blue-600 font-medium bg-blue-50 px-1.5 py-0.5 rounded">
                            {product.brand || "Laptop"}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-xs font-semibold text-gray-900 mb-1 line-clamp-2 min-h-[32px]">
                          {product.title.length > 45
                            ? `${product.title.substring(0, 45)}...`
                            : product.title}
                        </h3>

                        {/* Specs */}
                        <div className="space-y-0.5 mb-1.5">
                          {product.processor && (
                            <div className="flex items-center gap-1 text-[9px] text-gray-500">
                              <FiCpu size={9} />
                              <span className="line-clamp-1">
                                {product.processor}
                              </span>
                            </div>
                          )}
                          {product.generation && (
                            <div className="flex items-center gap-1 text-[8px] text-gray-400">
                              <span>{product.generation}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            {product.ram && (
                              <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                <FiDatabase size={9} />
                                <span>{product.ram}</span>
                              </div>
                            )}
                            {product.storage && (
                              <div className="flex items-center gap-1 text-[9px] text-gray-500">
                                <FiHardDrive size={9} />
                                <span>{product.storage}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dynamic Rating */}
                        <div className="flex items-center gap-1 mb-1.5">
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

                        {/* Price */}
                        <div className="mb-2">
                          <span className="text-sm font-bold text-gray-900">
                            Rs {product.price?.toLocaleString() || "0"}
                          </span>
                          {product.stock > 0 && product.stock <= 3 && (
                            <span className="ml-1 text-[8px] text-orange-500">
                              Only {product.stock} left
                            </span>
                          )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-1.5">
                          <button
                            onClick={(e) => handleBuyNow(product, e)}
                            disabled={product.stock <= 0}
                            className={`flex-1 text-white text-[10px] font-medium py-1.5 rounded transition ${
                              product.stock > 0
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                          >
                            {product.stock > 0 ? "Buy Now" : "Sold Out"}
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={product.stock <= 0}
                            className={`flex-1 text-white text-[10px] font-medium py-1.5 rounded transition flex items-center justify-center gap-1 ${
                              product.stock > 0
                                ? "bg-gray-800 hover:bg-gray-900"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                          >
                            <FiShoppingCart size={10} />
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
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
                  <FiAlertCircle className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-base font-bold text-gray-800 mb-1">
                  No products found
                </h3>
                <p className="text-xs text-gray-500">
                  Try adjusting your filters
                </p>
                <button
                  onClick={() =>
                    setFilters({
                      brand: [],
                      processor: [],
                      generation: [],
                      ram: [],
                      storage: [],
                      minPrice: 0,
                      maxPrice: 200000,
                    })
                  }
                  className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs transition"
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
            <div className="sticky top-0 bg-white border-b px-4 py-3 flex items-center justify-between">
              <h3 className="font-bold text-base">Filters</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-1"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="p-4 pb-8">
              <ProductFilters
                onFilterChange={setFilters}
                initialFilters={filters}
              />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full mt-5 bg-blue-600 text-white py-2.5 rounded-lg font-medium text-sm"
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
