import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AddLaptop = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const [formData, setFormData] = useState({
    title: "",
    price: "",
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

  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (name === "brand")
      setFormData((prev) => ({ ...prev, brand: value, model: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = [...formData.images, ...files];
    const newPreviews = [
      ...imagePreviews,
      ...files.map((f) => URL.createObjectURL(f)),
    ];
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const removeImage = (index) => {
    const newImages = [...formData.images];
    const newPreviews = [...imagePreviews];
    newImages.splice(index, 1);
    newPreviews.splice(index, 1);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      for (const key of Object.keys(formData)) {
        if (key === "images") {
          formData.images.forEach((img) => img && data.append("images", img));
        } else if (key === "featured") {
          data.append("featured", formData.featured ? "true" : "false");
        } else if (key === "price" || key === "stock") {
          data.append(key, String(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      }

      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/api/laptops/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success(result.message || "Laptop added successfully!");
        setFormData({
          title: "",
          price: "",
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
        setImagePreviews([]);
        navigate("/admin/view-products");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to add laptop");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 sm:py-6 px-3 sm:px-4 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl sm:rounded-2xl shadow-lg w-full max-w-5xl mx-auto p-4 sm:p-5 md:p-6 lg:p-8"
      >
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-800">
          Add New Laptop
        </h2>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Laptop Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              placeholder="e.g., Dell Latitude 7490"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Price (PKR) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              placeholder="e.g., 52000"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              placeholder="e.g., 5"
              min="0"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
              value={formData.type}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              onChange={handleChange}
              required
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
              value={formData.condition}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
              value={formData.location}
              placeholder="e.g., Lahore, Pakistan"
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
                value={formData.brand}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                onChange={handleChange}
                required
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
                value={formData.model}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                onChange={handleChange}
                disabled={!formData.brand}
                required
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
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            placeholder="Detailed description of the laptop..."
            className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-y text-sm"
            rows={4}
            onChange={handleChange}
            required
          />
        </div>

        {/* Processor & Generation */}
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
                value={formData.processor}
                placeholder="e.g., Intel Core i5"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Generation
              </label>
              <select
                name="generation"
                value={formData.generation}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
                value={formData.gpu}
                placeholder="e.g., Intel UHD, NVIDIA GTX 1650"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
                value={formData.ram}
                placeholder="e.g., 8GB, 16GB"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
                value={formData.storage}
                placeholder="e.g., 256GB SSD, 1TB HDD"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
                value={formData.screenSize}
                placeholder="e.g., 14 inch, 15.6 inch"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Resolution
              </label>
              <select
                name="resolution"
                value={formData.resolution}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
                value={formData.os}
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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
                value={formData.batteryHealth}
                placeholder="e.g., 85%, Good condition"
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
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

        {/* Image Upload */}
        <div className="mt-4 sm:mt-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Upload Images
          </label>
          <div className="flex flex-wrap gap-2 sm:gap-3 mb-3">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`preview ${index}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
                />
                <button
                  type="button"
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition"
                  onClick={() => removeImage(index)}
                >
                  ✕
                </button>
              </div>
            ))}
            <label className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition bg-gray-50">
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
          disabled={loading}
          className="w-full mt-6 sm:mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
              Adding Laptop...
            </div>
          ) : (
            "Add Laptop"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddLaptop;
