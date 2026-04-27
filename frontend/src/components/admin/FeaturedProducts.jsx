import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiArrowRight,
  FiStar,
  FiShoppingCart,
  FiCpu,
  FiHardDrive,
  FiDatabase,
  FiHeart,
} from "react-icons/fi";
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
    setIsLoggedIn(!!localStorage.getItem("token"));
    const savedWishlist = localStorage.getItem("wishlist");
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    const result = addToCart(product);
    result.success
      ? toast.success(result.message)
      : toast.error(result.message);
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("Please login to continue");
      return navigate("/login");
    }
    navigate("/checkout");
  };

  const toggleWishlist = (product, e) => {
    e.stopPropagation();
    let updated;
    if (wishlist.includes(product._id)) {
      updated = wishlist.filter((id) => id !== product._id);
    } else {
      updated = [...wishlist, product._id];
    }
    setWishlist(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/api/laptops/featured`);
        const data = await res.json();
        const list = data.laptops || data.data || data || [];
        setProducts(list);
      } catch {
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [API_URL]);

  if (loading) {
    return <div className="py-10 text-center">Loading...</div>;
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Featured Products
            </h2>
            <p className="text-sm text-gray-500">
              Latest handpicked laptops for you
            </p>
          </div>
          <Link
            to="/products"
            className="text-blue-600 font-medium flex items-center gap-1"
          >
            View All <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const rating = productRatings[product._id] || {
              average: 4,
              total: 0,
            };

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group bg-white rounded-2xl border border-gray-200 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="relative h-52 bg-gray-100 overflow-hidden">
                  <img
                    src={
                      product.images?.[0] ||
                      "https://via.placeholder.com/300x200"
                    }
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />

                  <button
                    onClick={(e) => toggleWishlist(product, e)}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow"
                  >
                    <FiHeart
                      className={
                        wishlist.includes(product._id)
                          ? "text-red-500 fill-red-500"
                          : "text-gray-500"
                      }
                    />
                  </button>
                </div>

                <div className="p-4">
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {product.brand || "Laptop"}
                  </span>

                  <h3 className="mt-2 text-sm font-semibold text-gray-900 line-clamp-2 min-h-[40px]">
                    {product.title}
                  </h3>

                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    {product.processor && (
                      <div className="flex items-center gap-2">
                        <FiCpu size={12} /> {product.processor}
                      </div>
                    )}

                    <div className="flex gap-4">
                      {product.ram && (
                        <div className="flex items-center gap-1">
                          <FiDatabase size={11} /> {product.ram}
                        </div>
                      )}
                      {product.storage && (
                        <div className="flex items-center gap-1">
                          <FiHardDrive size={11} /> {product.storage}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FiStar
                        key={star}
                        size={12}
                        className={
                          star <= Math.round(rating.average)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    ))}
                    <span className="text-xs text-gray-400">
                      ({rating.total})
                    </span>
                  </div>

                  <div className="mt-3 text-lg font-bold text-gray-900">
                    Rs {product.price?.toLocaleString()}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={(e) => handleBuyNow(product, e)}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-semibold"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={(e) => handleAddToCart(product, e)}
                      className="bg-gray-900 hover:bg-black text-white py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                    >
                      <FiShoppingCart size={14} /> Cart
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
