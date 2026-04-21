import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBolt } from "react-icons/fa";
import {
  FiStar,
  FiShoppingCart,
  FiMessageCircle,
  FiCheckCircle,
  FiAlertCircle,
  FiThumbsUp,
  FiThumbsDown,
} from "react-icons/fi";
import { addToCart } from "../../../utils/cartUtils";
import toast from "react-hot-toast";
import ProductReviews from "../../../components/ProductReviews";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchLaptop = async () => {
      try {
        const res = await fetch(`${API_URL}/api/laptops/${id}`);
        const data = await res.json();
        setLaptop(data);
        if (data.images && data.images.length > 0) {
          setSelectedImage(`${API_URL}/uploads/${data.images[0]}`);
        }
      } catch (error) {
        console.log("Error fetching laptop:", error);
        toast.error("Failed to load product details");
      }
    };
    fetchLaptop();
  }, [id, API_URL]);

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
      toast.error("❌ Failed to add to cart", { icon: "😢", duration: 3000 });
    }
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      toast.error("🔒 Please login to continue shopping!", {
        icon: "🔐",
        duration: 3000,
        style: { background: "linear-gradient(135deg, #991b1b, #ef4444)" },
      });
      setTimeout(() => {
        toast.loading("Taking you to login...", { duration: 1000 });
        setTimeout(
          () =>
            navigate("/login", { state: { from: `/product/${product._id}` } }),
          1000,
        );
      }, 500);
      return;
    }
    toast.success("🚀 Redirecting to secure checkout...", {
      icon: "💨",
      duration: 1500,
    });
    setTimeout(() => navigate(`/checkout?product=${product._id}`), 800);
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = "923104082056";
    const message = `🖥️ *Laptop Inquiry - LapHub.pk* 🖥️\n\n*Product:* ${laptop.title}\n*Price:* Rs ${laptop.price}\n*Brand:* ${laptop.brand}\n*Model:* ${laptop.model}\n*Processor:* ${laptop.processor}\n*RAM:* ${laptop.ram}\n*Storage:* ${laptop.storage}\n*Condition:* ${laptop.condition}\n*Location:* ${laptop.location}\n\n*Product Link:* ${window.location.href}\n\nI'm interested in this laptop. Please share more details.`;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
    toast.success("Opening WhatsApp...", { icon: "💬", duration: 2000 });
  };

  if (!laptop) {
    return (
      <div className="min-h-screen bg-[#f6f6f7] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  const features = [
    laptop.brand && `Brand: ${laptop.brand}`,
    laptop.model && `Model: ${laptop.model}`,
    laptop.type && `Type: ${laptop.type}`,
    laptop.processor && `Processor: ${laptop.processor}`,
    laptop.ram && `RAM: ${laptop.ram}`,
    laptop.storage && `Storage: ${laptop.storage}`,
    laptop.screenSize && `Screen Size: ${laptop.screenSize}`,
    laptop.condition && `Condition: ${laptop.condition}`,
    laptop.location && `Location: ${laptop.location}`,
  ].filter(Boolean);

  const descriptionLines = laptop.description
    ? laptop.description.split("\n").filter((line) => line.trim() !== "")
    : [];

  return (
    <section className="bg-[#f6f6f7] min-h-screen py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        {/* Product Main Info */}
        <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm p-4 sm:p-6 md:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10">
          {/* Left Side - Images */}
          <div>
            <div className="bg-[#f7f7f7] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden flex items-center justify-center h-[280px] sm:h-[360px] md:h-[420px] lg:h-[520px]">
              <img
                src={
                  selectedImage ||
                  "https://via.placeholder.com/500x400?text=No+Image"
                }
                alt={laptop.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-5 flex-wrap">
              {laptop.images && laptop.images.length > 0 ? (
                laptop.images.map((img, index) => {
                  const imageUrl = `${API_URL}/uploads/${img}`;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(imageUrl)}
                      className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-lg sm:rounded-xl overflow-hidden border-2 transition-all ${
                        selectedImage === imageUrl
                          ? "border-blue-600 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-blue-400"
                      } bg-[#f7f7f7]`}
                    >
                      <img
                        src={imageUrl}
                        alt={`thumb-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })
              ) : (
                <div className="text-gray-500 text-sm">No images available</div>
              )}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="flex flex-col">
            <div className="mb-2">
              <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-sm font-semibold rounded-full">
                {laptop.condition || "Laptop"}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-snug">
              {laptop.title}
            </h1>

            <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                Rs {laptop.price?.toLocaleString()}
              </p>
              {laptop.originalPrice && (
                <p className="text-sm sm:text-lg text-gray-400 line-through">
                  Rs {laptop.originalPrice.toLocaleString()}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-5">
              {[...Array(4)].map((_, i) => (
                <FiStar
                  key={i}
                  className="text-yellow-500 fill-yellow-400 text-xs sm:text-sm md:text-base"
                />
              ))}
              <FiStar className="text-gray-300 text-xs sm:text-sm md:text-base" />
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-sm text-gray-500">
                (4.0 rating)
              </span>
            </div>

            {/* Short Intro */}
            <p className="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7 mb-4 sm:mb-6">
              {descriptionLines.length > 0
                ? descriptionLines[0]
                : "A premium quality laptop with reliable performance, decent battery timing, and professional build quality. Perfect for office work, study, freelancing, and daily use."}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="bg-gray-50 rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3">
                <p className="text-[10px] sm:text-sm text-gray-500">Brand</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {laptop.brand}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3">
                <p className="text-[10px] sm:text-sm text-gray-500">Model</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {laptop.model}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3">
                <p className="text-[10px] sm:text-sm text-gray-500">
                  Condition
                </p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {laptop.condition}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg sm:rounded-xl px-2 py-2 sm:px-4 sm:py-3">
                <p className="text-[10px] sm:text-sm text-gray-500">Location</p>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {laptop.location}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 md:gap-4 mb-6 sm:mb-8 md:mb-10">
              <button
                onClick={(e) => handleBuyNow(laptop, e)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
              >
                <FaBolt className="text-sm sm:text-base md:text-lg" />
                Buy Now
              </button>
              <button
                onClick={(e) => handleAddToCart(laptop, e)}
                className="flex-1 bg-gray-900 hover:bg-black text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
              >
                <FiShoppingCart className="text-sm sm:text-base md:text-lg" />
                Add to Cart
              </button>
              <button
                onClick={handleWhatsAppOrder}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
              >
                <FiMessageCircle className="text-sm sm:text-base md:text-lg" />
                {/* <span className="hidden xs:inline">WhatsApp</span> */}
                WhatsApp
              </button>
            </div>

            {/* Stock Status */}
            <div className="mb-4 sm:mb-6">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs sm:text-sm text-green-600 font-medium">
                  In Stock
                </span>
                <span className="text-[10px] sm:text-xs text-gray-400">
                  • Ready to ship
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-4 sm:pt-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
                Key Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-y-3 gap-x-4 sm:gap-x-6 text-gray-700">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-1.5 sm:gap-2"
                  >
                    <FiCheckCircle className="text-blue-600 mt-0.5 flex-shrink-0 text-sm sm:text-base" />
                    <span className="text-xs sm:text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs for Description and Reviews */}
        <div className="mt-6 sm:mt-8">
          <div className="border-b border-gray-200">
            <nav className="flex gap-4 sm:gap-6 md:gap-8">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-3 sm:pb-4 text-sm sm:text-base md:text-lg font-semibold transition ${
                  activeTab === "description"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 sm:pb-4 text-sm sm:text-base md:text-lg font-semibold transition ${
                  activeTab === "reviews"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          {/* Description Tab */}
          {activeTab === "description" && (
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm p-4 sm:p-6 md:p-8 mt-4 sm:mt-6">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                Product Description
              </h3>
              <div className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base leading-6 sm:leading-7">
                {descriptionLines.length > 0 ? (
                  descriptionLines.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No detailed description available for this laptop right now.
                    Please contact us for more information.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm p-4 sm:p-6 md:p-8 mt-4 sm:mt-6">
              <ProductReviews productId={laptop._id} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
