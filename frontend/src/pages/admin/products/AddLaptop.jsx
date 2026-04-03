import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddLaptop = () => {
  const navigate = useNavigate();

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
    ram: "",
    storage: "",
    screenSize: "",
    images: [],
  });

  const [imagePreviews, setImagePreviews] = useState([]);

  const laptopData = {
    Dell: ["Latitude", "Inspiron", "XPS", "Vostro", "Precision"],
    HP: ["EliteBook", "ProBook", "Pavilion", "Envy"],
    Lenovo: ["ThinkPad", "IdeaPad", "Legion", "Yoga"],
    Apple: ["MacBook Air", "MacBook Pro"],
  };

  const types = [
    "Chromebook",
    "MacBook",
    "Traditional Laptop",
    "Notebook",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "brand")
      setFormData((prev) => ({ ...prev, brand: value, model: "" }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData({ ...formData, images: newImages });

    const newPreviews = [...imagePreviews];
    newPreviews[index] = URL.createObjectURL(file);
    setImagePreviews(newPreviews);
  };

  const addImageSlot = () => {
    setFormData({ ...formData, images: [...formData.images, null] });
    setImagePreviews([...imagePreviews, null]);
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
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((img) => img && data.append("images", img));
        } else {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/laptops/add`,
        {
          method: "POST",
          body: data,
        },
      );

      const result = await res.json();
      alert(result.message);

      // Reset form
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
        ram: "",
        storage: "",
        screenSize: "",
        images: [],
      });
      setImagePreviews([]);

      // Redirect
      navigate("/admin/view-products");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Add Laptop</h2>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            placeholder="Laptop Title"
            className="input"
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            placeholder="Price (PKR)"
            className="input"
            onChange={handleChange}
            required
          />
          <select
            name="type"
            value={formData.type}
            className="input"
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            {types.map((t, i) => (
              <option key={i} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            name="condition"
            value={formData.condition}
            className="input"
            onChange={handleChange}
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Refurbished">Refurbished</option>
          </select>
          <input
            type="text"
            name="location"
            value={formData.location}
            placeholder="Location"
            className="input"
            onChange={handleChange}
            required
          />
        </div>

        {/* Brand + Model */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Brand & Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="brand"
            value={formData.brand}
            className="input"
            onChange={handleChange}
          >
            <option value="">Select Brand</option>
            {Object.keys(laptopData).map((brand, i) => (
              <option key={i} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <select
            name="model"
            value={formData.model}
            className="input"
            onChange={handleChange}
            disabled={!formData.brand}
          >
            <option value="">Select Model</option>
            {formData.brand &&
              laptopData[formData.brand].map((model, i) => (
                <option key={i} value={model}>
                  {model}
                </option>
              ))}
          </select>
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={formData.description}
          placeholder="Description"
          className="input mt-4"
          rows="4"
          onChange={handleChange}
        ></textarea>

        {/* Specifications */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="processor"
            value={formData.processor}
            placeholder="Processor (i5 6th Gen)"
            className="input"
            onChange={handleChange}
          />
          <input
            type="text"
            name="ram"
            value={formData.ram}
            placeholder="RAM (8GB)"
            className="input"
            onChange={handleChange}
          />
          <input
            type="text"
            name="storage"
            value={formData.storage}
            placeholder="Storage (256GB SSD)"
            className="input"
            onChange={handleChange}
          />
          <input
            type="text"
            name="screenSize"
            value={formData.screenSize}
            placeholder="Screen Size (14 inch)"
            className="input"
            onChange={handleChange}
          />
        </div>

        {/* OLX-style Image Upload with Remove */}
        <h3 className="text-lg font-semibold mt-6 mb-3">Upload Images</h3>
        <div className="flex gap-4 flex-wrap">
          {imagePreviews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`preview ${index}`}
                className="w-24 h-24 object-cover rounded border"
              />
              <button
                type="button"
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                onClick={() => {
                  const newImages = [...formData.images];
                  const newPreviews = [...imagePreviews];
                  newImages.splice(index, 1);
                  newPreviews.splice(index, 1);
                  setFormData({ ...formData, images: newImages });
                  setImagePreviews(newPreviews);
                }}
              >
                x
              </button>
            </div>
          ))}

          {/* Single "+" box for adding new image */}
          <label className="w-24 h-24 flex items-center justify-center border rounded cursor-pointer bg-gray-100 text-gray-500">
            +
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;

                // Add file to images
                setFormData((prev) => ({
                  ...prev,
                  images: [...prev.images, file],
                }));
                // Add preview
                setImagePreviews((prev) => [
                  ...prev,
                  URL.createObjectURL(file),
                ]);

                // Clear input value so same file can be selected again if needed
                e.target.value = null;
              }}
            />
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Add Laptop
        </button>

        <style>{`
          .input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ccc;
            border-radius: 10px;
            outline: none;
            transition: 0.3s;
          }
          .input:focus {
            border-color: #2563eb;
            box-shadow: 0 0 5px rgba(37, 99, 235, 0.5);
          }
        `}</style>
      </form>
    </div>
  );
};

export default AddLaptop;
