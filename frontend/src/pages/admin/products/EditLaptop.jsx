import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import TipTapEditor from "../../../components/TipTapEditor";

const EditLaptop = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    title: "",
    costPrice: "",
    sellingPrice: "",
    condition: "Used",
    location: "",
    description: "",
    type: "",
    brand: "",
    model: "",
    processor: "",
    generation: "",
    ram: "",
    storage: "",
    screenSize: "",
    resolution: "",
    gpu: "",
    os: "",
    batteryHealth: "",
    stock: "1",
    featured: false,
    status: "available",
    images: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const laptopData = {
    Dell: ["Latitude", "Inspiron", "XPS", "Vostro", "Precision"],
    HP: ["EliteBook", "ProBook", "Pavilion", "Envy", "ZBook"],
    Lenovo: ["ThinkPad", "IdeaPad", "Legion", "Yoga", "ThinkBook"],
    Apple: ["MacBook Air", "MacBook Pro"],
    ASUS: ["Vivobook", "Zenbook", "ROG", "TUF"],
    Acer: ["Aspire", "Predator", "Swift", "Nitro"],
  };

  const types = [
    "Traditional Laptop",
    "MacBook",
    "Chromebook",
    "Notebook",
    "2-in-1 Laptop",
    "Gaming Laptop",
    "Ultrabook",
    "Other",
  ];

  const generations = [
    "Intel Core 3rd Gen",
    "Intel Core 4th Gen",
    "Intel Core 5th Gen",
    "Intel Core 6th Gen",
    "Intel Core 7th Gen",
    "Intel Core 8th Gen",
    "Intel Core 9th Gen",
    "Intel Core 10th Gen",
    "Intel Core 11th Gen",
    "Intel Core 12th Gen",
    "Intel Core 13th Gen",
    "Intel Core 14th Gen",
    "AMD Ryzen 3",
    "AMD Ryzen 5",
    "AMD Ryzen 7",
    "AMD Ryzen 9",
  ];

  const resolutions = [
    "HD (1366x768)",
    "Full HD (1920x1080)",
    "2K (2560x1440)",
    "4K (3840x2160)",
    "Retina Display",
  ];

  const osOptions = [
    "Windows 10",
    "Windows 11",
    "macOS",
    "Linux",
    "Chrome OS",
    "No OS",
  ];

  const statusOptions = [
    { value: "available", label: "Available" },
    { value: "sold", label: "Sold" },
    { value: "reserved", label: "Reserved" },
  ];

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${API_URL}/uploads/${imagePath}`;
  };

  // Calculate profit preview
  const costPrice = Number(formData.costPrice);
  const sellingPrice = Number(formData.sellingPrice);
  const expectedProfit = sellingPrice - costPrice;
  const profitMargin =
    costPrice > 0 ? ((expectedProfit / costPrice) * 100).toFixed(1) : 0;

  useEffect(() => {
    const fetchLaptop = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/api/laptops/${id}`);
        const data = await res.json();
        console.log("Fetched laptop data:", data);

        let laptopData = data.laptop || data;

        setFormData({
          title: laptopData.title || "",
          costPrice: laptopData.costPrice || "",
          sellingPrice: laptopData.sellingPrice || laptopData.price || "",
          condition: laptopData.condition || "Used",
          location: laptopData.location || "",
          description: laptopData.description || "",
          type: laptopData.type || "",
          brand: laptopData.brand || "",
          model: laptopData.model || "",
          processor: laptopData.processor || "",
          generation: laptopData.generation || "",
          ram: laptopData.ram || "",
          storage: laptopData.storage || "",
          screenSize: laptopData.screenSize || "",
          resolution: laptopData.resolution || "",
          gpu: laptopData.gpu || "",
          os: laptopData.os || "",
          batteryHealth: laptopData.batteryHealth || "",
          stock: laptopData.stock !== undefined ? laptopData.stock : "1",
          featured: laptopData.featured || false,
          status: laptopData.status || "available",
          images: [],
        });

        setExistingImages(laptopData.images || []);
      } catch (error) {
        console.log("Error fetching laptop:", error);
        toast.error("Failed to load laptop data");
      } finally {
        setLoading(false);
      }
    };
    fetchLaptop();
  }, [id, API_URL]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "brand") {
      setFormData((prev) => ({
        ...prev,
        brand: value,
        model: "",
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));
  };

  const removeNewImage = (index) => {
    const newPreviews = [...imagePreviews];
    const newImages = [...formData.images];
    newPreviews.splice(index, 1);
    newImages.splice(index, 1);
    setImagePreviews(newPreviews);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((img) => img && data.append("images", img));
        } else {
          data.append(key, formData[key]);
        }
      });

      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/api/laptops/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || "Laptop updated successfully");
        navigate("/admin/view-products");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update laptop");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl sm:rounded-2xl shadow-lg w-full max-w-5xl mx-auto p-4 sm:p-5 md:p-6 lg:p-8"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
          Edit Laptop
        </h2>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Laptop Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="Laptop Title"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          {/* Price Section - Two Fields */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Cost Price (PKR) *
              <span className="text-gray-400 text-xs ml-1">
                (What you paid)
              </span>
            </label>
            <input
              type="number"
              name="costPrice"
              value={formData.costPrice}
              placeholder="e.g., 56000"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Selling Price (PKR) *
              <span className="text-gray-400 text-xs ml-1">
                (Customer pays)
              </span>
            </label>
            <input
              type="number"
              name="sellingPrice"
              value={formData.sellingPrice}
              placeholder="e.g., 61000"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={handleChange}
              required
            />
          </div>

          {/* Profit Preview */}
          {formData.costPrice &&
            formData.sellingPrice &&
            Number(formData.sellingPrice) > 0 && (
              <div
                className={`p-3 rounded-lg ${sellingPrice > costPrice ? "bg-green-50" : "bg-red-50"} sm:col-span-2`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Expected Profit:</span>
                  <span
                    className={`text-lg font-bold ${sellingPrice > costPrice ? "text-green-600" : "text-red-600"}`}
                  >
                    Rs {expectedProfit.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">Profit Margin:</span>
                  <span
                    className={`text-sm font-semibold ${sellingPrice > costPrice ? "text-green-600" : "text-red-600"}`}
                  >
                    {profitMargin}%
                  </span>
                </div>
              </div>
            )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              placeholder="Stock"
              min="0"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.status}
              onChange={handleChange}
            >
              {statusOptions.map((opt, i) => (
                <option key={i} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Type *
            </label>
            <select
              name="type"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="">Select Type</option>
              {types.map((t, i) => (
                <option key={i} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Condition *
            </label>
            <select
              name="condition"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.condition}
              onChange={handleChange}
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Refurbished">Refurbished</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Brand & Model */}
        <div className="mt-4 sm:mt-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
            Brand & Model
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Brand *
              </label>
              <select
                name="brand"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.brand}
                onChange={handleChange}
              >
                <option value="">Select Brand</option>
                {Object.keys(laptopData).map((brand, i) => (
                  <option key={i} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <select
                name="model"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                value={formData.model}
                onChange={handleChange}
                disabled={!formData.brand}
              >
                <option value="">Select Model</option>
                {formData.brand &&
                  laptopData[formData.brand]?.map((model, i) => (
                    <option key={i} value={model}>
                      {model}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 sm:mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <TipTapEditor
            value={formData.description}
            onChange={handleDescriptionChange}
          />
        </div>

        {/* Processor & Performance */}
        <div className="mt-4 sm:mt-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
            Processor & Performance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Processor
              </label>
              <input
                type="text"
                name="processor"
                placeholder="Processor (Intel Core i5)"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.processor}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Generation
              </label>
              <select
                name="generation"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.generation}
                onChange={handleChange}
              >
                <option value="">Select Generation</option>
                {generations.map((gen, i) => (
                  <option key={i} value={gen}>
                    {gen}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                GPU / Graphics
              </label>
              <input
                type="text"
                name="gpu"
                placeholder="Graphics Card"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.gpu}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                RAM
              </label>
              <input
                type="text"
                name="ram"
                placeholder="RAM (8GB)"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.ram}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Storage
              </label>
              <input
                type="text"
                name="storage"
                placeholder="Storage (256GB SSD)"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.storage}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Display & Screen */}
        <div className="mt-4 sm:mt-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
            Display & Screen
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Screen Size
              </label>
              <input
                type="text"
                name="screenSize"
                placeholder="Screen Size (14 inch)"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.screenSize}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Resolution
              </label>
              <select
                name="resolution"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.resolution}
                onChange={handleChange}
              >
                <option value="">Select Resolution</option>
                {resolutions.map((res, i) => (
                  <option key={i} value={res}>
                    {res}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Software & Battery */}
        <div className="mt-4 sm:mt-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">
            Software & Battery
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Operating System
              </label>
              <select
                name="os"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.os}
                onChange={handleChange}
              >
                <option value="">Select OS</option>
                {osOptions.map((os, i) => (
                  <option key={i} value={os}>
                    {os}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Battery Health
              </label>
              <input
                type="text"
                name="batteryHealth"
                placeholder="Battery Health (85%)"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                value={formData.batteryHealth}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Featured */}
        <div className="mt-4 sm:mt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleChange}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Featured Product (Show on Homepage)
            </span>
          </label>
        </div>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="mt-4 sm:mt-6">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Existing Images
            </label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {existingImages.map((img, index) => (
                <img
                  key={index}
                  src={getImageUrl(img)}
                  alt={`Laptop ${index}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/80x80?text=No+Image";
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upload New Images */}
        <div className="mt-4 sm:mt-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Upload New Images
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`preview ${index}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition"
                  onClick={() => removeNewImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition bg-gray-50">
              <span className="text-xl sm:text-2xl text-gray-400">+</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-500">
            You can select multiple images (Max 5)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
              Updating...
            </div>
          ) : (
            "Update Laptop"
          )}
        </button>
      </form>
    </div>
  );
};

export default EditLaptop;
