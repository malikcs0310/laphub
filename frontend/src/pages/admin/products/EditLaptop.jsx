import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditLaptop = () => {
  const { id } = useParams();
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

  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchLaptop = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/laptops/${id}`);
        const data = await res.json();

        setFormData({
          title: data.title || "",
          price: data.price || "",
          condition: data.condition || "Used",
          location: data.location || "",
          description: data.description || "",
          type: data.type || "",
          brand: data.brand || "",
          model: data.model || "",
          processor: data.processor || "",
          ram: data.ram || "",
          storage: data.storage || "",
          screenSize: data.screenSize || "",
          images: [],
        });

        setExistingImages(data.images || []);
      } catch (error) {
        console.log("Error fetching laptop:", error);
        alert("Failed to load laptop data");
      } finally {
        setLoading(false);
      }
    };

    fetchLaptop();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      setFormData((prev) => ({
        ...prev,
        images: files,
      }));
    } else if (name === "brand") {
      setFormData((prev) => ({
        ...prev,
        brand: value,
        model: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          for (let i = 0; i < formData.images.length; i++) {
            data.append("images", formData.images[i]);
          }
        } else {
          data.append(key, formData[key]);
        }
      });

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/laptops/${id}`,
        {
          method: "PUT",
          body: data,
        },
      );

      const result = await res.json();

      alert(result.message || "Laptop updated successfully");
      navigate("/admin/view-products");
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  if (loading) {
    return <div className="p-6 text-lg font-medium">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-3xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Laptop</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Laptop Title"
            className="input"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price (PKR)"
            className="input"
            value={formData.price}
            onChange={handleChange}
            required
          />

          <select
            name="type"
            className="input"
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

          <select
            name="condition"
            className="input"
            value={formData.condition}
            onChange={handleChange}
          >
            <option value="New">New</option>
            <option value="Used">Used</option>
            <option value="Refurbished">Refurbished</option>
          </select>

          <input
            type="text"
            name="location"
            placeholder="Location"
            className="input"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Brand & Model</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            name="brand"
            className="input"
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

          <select
            name="model"
            className="input"
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

        <textarea
          name="description"
          placeholder="Description"
          className="input mt-4"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <h3 className="text-lg font-semibold mt-6 mb-3">Specifications</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="processor"
            placeholder="Processor (i5 6th Gen)"
            className="input"
            value={formData.processor}
            onChange={handleChange}
          />

          <input
            type="text"
            name="ram"
            placeholder="RAM (8GB)"
            className="input"
            value={formData.ram}
            onChange={handleChange}
          />

          <input
            type="text"
            name="storage"
            placeholder="Storage (256GB SSD)"
            className="input"
            value={formData.storage}
            onChange={handleChange}
          />

          <input
            type="text"
            name="screenSize"
            placeholder="Screen Size (14 inch)"
            className="input"
            value={formData.screenSize}
            onChange={handleChange}
          />
        </div>

        {existingImages.length > 0 && (
          <div className="mt-6">
            <label className="block mb-2 font-medium">Existing Images</label>
            <div className="flex flex-wrap gap-3">
              {existingImages.map((img, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000/uploads/${img}`}
                  alt={`Laptop ${index}`}
                  className="w-24 h-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <label className="block mb-2 font-medium">Upload New Images</label>
          <input
            type="file"
            name="images"
            multiple
            className="w-full"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
        >
          Update Laptop
        </button>
      </form>

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
    </div>
  );
};

export default EditLaptop;
