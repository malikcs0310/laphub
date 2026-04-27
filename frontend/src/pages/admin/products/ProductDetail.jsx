import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBolt } from "react-icons/fa";
import {
  FiStar,
  FiShoppingCart,
  FiMessageCircle,
  FiCheckCircle,
  FiTruck,
  FiZoomIn,
  FiClock,
  FiShield,
  FiCpu,
  FiHardDrive,
  FiDatabase,
  FiMonitor,
  FiBarChart2,
} from "react-icons/fi";
import { addToCart } from "../../../utils/cartUtils";
import toast from "react-hot-toast";
import ProductReviews from "../../../components/ProductReviews";

// Product Specs Table Component
const ProductSpecsTable = ({ laptop }) => {
  const specs = [
    { label: "Brand", value: laptop?.brand, icon: <FiMonitor /> },
    { label: "Model", value: laptop?.model, icon: <FiMonitor /> },
    { label: "Processor", value: laptop?.processor, icon: <FiCpu /> },
    {
      label: "Processor Generation",
      value: laptop?.generation || "Not Specified",
      icon: <FiCpu />,
    },
    { label: "RAM", value: laptop?.ram, icon: <FiDatabase /> },
    { label: "Storage", value: laptop?.storage, icon: <FiHardDrive /> },
    { label: "Screen Size", value: laptop?.screenSize, icon: <FiMonitor /> },
    {
      label: "Resolution",
      value: laptop?.resolution || "Not Specified",
      icon: <FiMonitor />,
    },
    {
      label: "Graphics / GPU",
      value: laptop?.gpu || "Integrated",
      icon: <FiMonitor />,
    },
    {
      label: "Operating System",
      value: laptop?.os || "Not Specified",
      icon: <FiMonitor />,
    },
    {
      label: "Battery Health",
      value: laptop?.batteryHealth || "80-90%",
      icon: <FiBarChart2 />,
    },
    { label: "Condition", value: laptop?.condition, icon: <FiCheckCircle /> },
    {
      label: "Stock Status",
      value: laptop?.stock > 0 ? `${laptop.stock} in stock` : "Out of stock",
      icon: <FiCheckCircle />,
    },
    { label: "Location", value: laptop?.location, icon: <FiMonitor /> },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <tbody>
          {specs.map((spec, index) => (
            <tr
              key={index}
              className={`border-b ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
            >
              <td className="px-4 py-3 font-semibold text-gray-700 w-1/3">
                <div className="flex items-center gap-2">
                  {spec.icon}
                  {spec.label}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {spec.value || "Not Specified"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomImage, setZoomImage] = useState("");
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Get image URL (supports both local uploads and Cloudinary)
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL (Cloudinary), return as is
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    // Otherwise, it's a local upload
    return `${API_URL}/uploads/${imagePath}`;
  };

  // Fetch laptop details
  useEffect(() => {
    const fetchLaptop = async () => {
      try {
        const res = await fetch(`${API_URL}/api/laptops/${id}`);
        const data = await res.json();
        const productData = data.laptop || data;
        setLaptop(productData);
        if (
          productData?.images &&
          Array.isArray(productData.images) &&
          productData.images.length > 0
        ) {
          setSelectedImage(getImageUrl(productData.images[0]));
        }
      } catch (error) {
        console.log("Error fetching laptop:", error);
        toast.error("Failed to load product details");
      }
    };
    fetchLaptop();
  }, [id, API_URL]);

  // Fetch real-time rating
  useEffect(() => {
    const fetchRating = async () => {
      try {
        const res = await fetch(`${API_URL}/api/reviews/product/${id}/summary`);
        const data = await res.json();
        setAverageRating(data.average || 0);
        setTotalReviews(data.total || 0);
      } catch (error) {
        console.log("Rating fetch failed:", error);
      }
    };
    if (id) fetchRating();
  }, [id, API_URL]);

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
      setTimeout(
        () =>
          navigate("/login", { state: { from: `/product/${product._id}` } }),
        1000,
      );
      return;
    }
    toast.success("🚀 Redirecting to secure checkout...");
    setTimeout(() => navigate(`/checkout?product=${product._id}`), 800);
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = "923104082056";
    const message = `🖥️ *Laptop Inquiry - LapHub.pk* 🖥️\n\n*Product:* ${laptop.title}\n*Price:* Rs ${laptop.price?.toLocaleString()}\n*Brand:* ${laptop.brand}\n*Model:* ${laptop.model}\n*Processor:* ${laptop.processor}\n*Generation:* ${laptop.generation || "N/A"}\n*RAM:* ${laptop.ram}\n*Storage:* ${laptop.storage}\n*GPU:* ${laptop.gpu || "Integrated"}\n*OS:* ${laptop.os || "N/A"}\n*Condition:* ${laptop.condition}\n*Location:* ${laptop.location}\n*Stock:* ${laptop.stock > 0 ? "In Stock" : "Out of Stock"}\n\n*Product Link:* ${window.location.href}\n\nI'm interested in this laptop. Please share more details.`;
    window.open(
      `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
    toast.success("Opening WhatsApp...", { icon: "💬", duration: 2000 });
  };

  const openZoom = (imageUrl) => {
    setZoomImage(imageUrl);
    setIsZoomOpen(true);
  };

  // Early return if laptop is still loading
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

  // Safe check for images
  const hasImages =
    laptop.images && Array.isArray(laptop.images) && laptop.images.length > 0;

  const features = [
    laptop.brand && `Brand: ${laptop.brand}`,
    laptop.model && `Model: ${laptop.model}`,
    laptop.type && `Type: ${laptop.type}`,
    laptop.processor && `Processor: ${laptop.processor}`,
    laptop.generation && `Generation: ${laptop.generation}`,
    laptop.ram && `RAM: ${laptop.ram}`,
    laptop.storage && `Storage: ${laptop.storage}`,
    laptop.gpu && `GPU: ${laptop.gpu}`,
    laptop.os && `OS: ${laptop.os}`,
    laptop.screenSize && `Screen: ${laptop.screenSize}`,
    laptop.resolution && `Resolution: ${laptop.resolution}`,
    laptop.batteryHealth && `Battery Health: ${laptop.batteryHealth}`,
    laptop.condition && `Condition: ${laptop.condition}`,
    laptop.location && `Location: ${laptop.location}`,
    laptop.stock > 0
      ? `Stock: ${laptop.stock} available`
      : "Stock: Out of stock",
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
            <div className="relative bg-[#f7f7f7] rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden flex items-center justify-center h-[280px] sm:h-[360px] md:h-[420px] lg:h-[520px] group">
              <img
                src={
                  selectedImage ||
                  "https://via.placeholder.com/500x400?text=No+Image"
                }
                alt={laptop.title}
                className="max-h-full max-w-full object-contain cursor-zoom-in"
                onClick={() => selectedImage && openZoom(selectedImage)}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/500x400?text=No+Image";
                }}
              />
              {selectedImage && (
                <button
                  onClick={() => openZoom(selectedImage)}
                  className="absolute bottom-4 right-4 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition"
                >
                  <FiZoomIn className="text-gray-700 text-xl" />
                </button>
              )}
            </div>

            <div className="flex gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-5 flex-wrap">
              {hasImages ? (
                laptop.images.map((img, index) => {
                  const imageUrl = getImageUrl(img);
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
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/100x80?text=No+Image";
                        }}
                      />
                    </button>
                  );
                })
              ) : (
                <div className="text-gray-500 text-sm w-full text-center py-4">
                  No images available
                </div>
              )}
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="flex flex-col">
            <div className="mb-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-100 text-blue-700 text-[10px] sm:text-sm font-semibold rounded-full">
                {laptop.condition || "Laptop"}
              </span>
              {laptop.stock <= 0 && (
                <span className="inline-flex items-center px-2 py-0.5 bg-red-100 text-red-700 text-[10px] sm:text-sm font-semibold rounded-full">
                  Out of Stock
                </span>
              )}
              {laptop.featured && (
                <span className="inline-flex items-center px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] sm:text-sm font-semibold rounded-full">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 leading-snug">
              {laptop.title}
            </h1>

            <div className="flex items-baseline gap-2 sm:gap-3 mb-2">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                Rs {laptop.price?.toLocaleString()}
              </p>
            </div>

            {/* Real-time Rating */}
            <div className="flex items-center gap-0.5 sm:gap-1 mb-3 sm:mb-5">
              {[1, 2, 3, 4, 5].map((star) => (
                <FiStar
                  key={star}
                  className={`text-xs sm:text-sm md:text-base ${
                    star <= Math.round(averageRating)
                      ? "text-yellow-500 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 sm:ml-2 text-[10px] sm:text-sm text-gray-500">
                ({totalReviews} {totalReviews === 1 ? "review" : "reviews"})
              </span>
            </div>

            {/* Short Intro */}
            <p className="text-gray-600 text-sm sm:text-base leading-6 sm:leading-7 mb-4 sm:mb-6">
              {descriptionLines[0] ||
                "A premium quality laptop with reliable performance, decent battery timing, and professional build quality."}
            </p>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">
              <div className="bg-gray-50 rounded-lg px-2 py-2">
                <p className="text-[10px] text-gray-500">Brand</p>
                <p className="font-semibold text-gray-800 text-xs">
                  {laptop.brand}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-2">
                <p className="text-[10px] text-gray-500">Model</p>
                <p className="font-semibold text-gray-800 text-xs">
                  {laptop.model}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-2">
                <p className="text-[10px] text-gray-500">Processor</p>
                <p className="font-semibold text-gray-800 text-xs">
                  {laptop.processor}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-2">
                <p className="text-[10px] text-gray-500">Generation</p>
                <p className="font-semibold text-gray-800 text-xs">
                  {laptop.generation || "N/A"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-2">
                <p className="text-[10px] text-gray-500">RAM</p>
                <p className="font-semibold text-gray-800 text-xs">
                  {laptop.ram}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-2">
                <p className="text-[10px] text-gray-500">Storage</p>
                <p className="font-semibold text-gray-800 text-xs">
                  {laptop.storage}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-2">
                <p className="text-[10px] text-gray-500">Condition</p>
                <p className="font-semibold text-gray-800 text-xs">
                  {laptop.condition}
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg px-2 py-2">
                <p className="text-[10px] text-gray-500">Location</p>
                <p className="font-semibold text-gray-800 text-xs">
                  {laptop.location}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 mb-6">
              <button
                onClick={(e) => handleBuyNow(laptop, e)}
                disabled={laptop.stock <= 0}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-sm ${
                  laptop.stock > 0
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    : "bg-gray-400 cursor-not-allowed text-gray-200"
                }`}
              >
                <FaBolt /> {laptop.stock > 0 ? "Buy Now" : "Out of Stock"}
              </button>
              <button
                onClick={(e) => handleAddToCart(laptop, e)}
                disabled={laptop.stock <= 0}
                className={`flex-1 px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-sm ${
                  laptop.stock > 0
                    ? "bg-gray-900 hover:bg-black text-white"
                    : "bg-gray-400 cursor-not-allowed text-gray-200"
                }`}
              >
                <FiShoppingCart /> Add to Cart
              </button>
              <button
                onClick={handleWhatsAppOrder}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 text-sm"
              >
                <FiMessageCircle /> WhatsApp
              </button>
            </div>

            {/* Stock Status */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${laptop.stock > 0 ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span
                  className={`text-xs font-medium ${laptop.stock > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {laptop.stock > 0
                    ? `In Stock (${laptop.stock} available)`
                    : "Out of Stock"}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="border-t pt-4">
              <h3 className="text-base font-bold text-gray-900 mb-3">
                Key Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-gray-700">
                {features.slice(0, 10).map((feature, index) => (
                  <div key={index} className="flex items-start gap-1.5">
                    <FiCheckCircle className="text-blue-600 mt-0.5 flex-shrink-0 text-sm" />
                    <span className="text-xs">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-6">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-3 text-sm font-semibold transition ${
                  activeTab === "description"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab("specifications")}
                className={`pb-3 text-sm font-semibold transition ${
                  activeTab === "specifications"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Specifications
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 text-sm font-semibold transition ${
                  activeTab === "reviews"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
              >
                Reviews
              </button>
            </nav>
          </div>

          {/* Description Tab */}
          {activeTab === "description" && (
            <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Product Description
              </h3>
              <div className="space-y-2 text-gray-700">
                {descriptionLines.length > 0 ? (
                  descriptionLines.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No detailed description available. Please contact us for
                    more information.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === "specifications" && (
            <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Complete Specifications
              </h3>
              <ProductSpecsTable laptop={laptop} />

              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-3">
                  Delivery Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <FiTruck className="text-blue-600" />
                    <span>Nationwide delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiClock className="text-blue-600" />
                    <span>2-4 business days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiShield className="text-blue-600" />
                    <span>Secure packaging</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FiCheckCircle className="text-blue-600" />
                    <span>Cash on Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === "reviews" && (
            <div className="bg-white rounded-xl shadow-sm p-6 mt-4">
              <ProductReviews productId={laptop._id} />
            </div>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-2xl"
            >
              ✕ Close
            </button>
            <img
              src={zoomImage}
              alt="Zoomed view"
              className="w-full h-auto max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetail;
