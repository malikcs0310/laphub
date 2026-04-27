import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiRefreshCw,
  FiCpu,
  FiHardDrive,
  FiDatabase,
} from "react-icons/fi";
import toast from "react-hot-toast";

const ViewProducts = () => {
  const [laptops, setLaptops] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchLaptops = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/api/laptops`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("Fetched laptops:", data);

      if (Array.isArray(data)) {
        setLaptops(data);
      } else {
        setLaptops(data.laptops || data.data || []);
      }
    } catch (error) {
      console.log("Error fetching:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const token = localStorage.getItem("adminToken");
      await fetch(`${API_URL}/api/laptops/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Product deleted successfully");
      fetchLaptops();
      setSelectedProducts(selectedProducts.filter((pid) => pid !== id));
    } catch (error) {
      console.log("Delete error:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleSelectProduct = (id) => {
    setSelectedProducts((prev) =>
      prev.includes(id)
        ? prev.filter((productId) => productId !== id)
        : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredLaptops.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredLaptops.map((lap) => lap._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedProducts.length} selected products?`,
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await Promise.all(
        selectedProducts.map((id) =>
          fetch(`${API_URL}/api/laptops/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
          }),
        ),
      );
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setSelectedProducts([]);
      fetchLaptops();
    } catch (error) {
      console.log("Bulk delete error:", error);
      toast.error("Failed to delete selected products");
    }
  };

  const filteredLaptops = laptops.filter(
    (lap) =>
      lap.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lap.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lap.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lap.processor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lap.generation?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatPrice = (price) => `Rs ${Number(price).toLocaleString()}`;

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

  const getStockBadge = (stock) => {
    if (stock === undefined || stock === null) {
      return (
        <span className="text-gray-600 text-xs font-semibold">
          Update Stock
        </span>
      );
    }
    if (stock <= 0) {
      return (
        <span className="text-red-600 text-xs font-semibold">Out of Stock</span>
      );
    } else if (stock <= 3) {
      return (
        <span className="text-orange-600 text-xs font-semibold">
          Low Stock ({stock})
        </span>
      );
    } else {
      return (
        <span className="text-green-600 text-xs font-semibold">
          In Stock ({stock})
        </span>
      );
    }
  };

  const getStatusBadge = (status) => {
    if (!status) {
      return (
        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
          Available
        </span>
      );
    }
    switch (status) {
      case "available":
        return (
          <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-xs">
            Available
          </span>
        );
      case "sold":
        return (
          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs">
            Sold
          </span>
        );
      case "reserved":
        return (
          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs">
            Reserved
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
            {status || "Available"}
          </span>
        );
    }
  };

  const handleEdit = (id) => {
    console.log("Editing product with id:", id);
    navigate(`/admin/edit-laptop/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-gray-100/95 border-b border-gray-200 pb-3 sm:pb-4 pt-2 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">Admin Products</h2>
            <p className="text-xs text-gray-500 mt-1">
              Manage your laptop inventory
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/admin/add-laptop")}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition flex items-center gap-1.5 text-sm"
            >
              <FiPlus size={14} />
              Add Laptop
            </button>

            {selectedProducts.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition flex items-center gap-1.5 text-sm"
              >
                <FiTrash2 size={14} />
                Delete ({selectedProducts.length})
              </button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by title, brand, model, processor, generation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <button
            onClick={fetchLaptops}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-sm"
          >
            <FiRefreshCw size={12} />
            Refresh
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] sm:min-w-full text-sm">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-2 sm:p-3 text-center w-12">#</th>
                <th className="p-2 sm:p-3 w-16">Image</th>
                <th className="p-2 sm:p-3">Title</th>
                <th className="p-2 sm:p-3">Brand</th>
                <th className="p-2 sm:p-3">Model</th>
                <th className="p-2 sm:p-3">Price</th>
                <th className="p-2 sm:p-3 hidden md:table-cell">Processor</th>
                <th className="p-2 sm:p-3 hidden lg:table-cell">RAM/Storage</th>
                <th className="p-2 sm:p-3">Stock</th>
                <th className="p-2 sm:p-3">Status</th>
                <th className="p-2 sm:p-3">Actions</th>
                <th className="p-2 sm:p-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={
                      filteredLaptops.length > 0 &&
                      selectedProducts.length === filteredLaptops.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLaptops.length > 0 ? (
                filteredLaptops.map((lap, index) => (
                  <tr
                    key={lap._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-2 sm:p-3 font-medium text-center text-xs sm:text-sm">
                      {index + 1}
                    </td>
                    <td className="p-2 sm:p-3">
                      {lap.images && lap.images.length > 0 ? (
                        <img
                          src={getImageUrl(lap.images[0])}
                          alt="laptop"
                          className="w-12 h-10 sm:w-14 sm:h-11 object-cover rounded"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/80x60?text=No+Image";
                          }}
                        />
                      ) : (
                        <div className="w-12 h-10 sm:w-14 sm:h-11 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="p-2 sm:p-3">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
                          {lap.title.length > 35
                            ? `${lap.title.substring(0, 35)}...`
                            : lap.title}
                        </p>
                        {lap.featured && (
                          <span className="inline-block bg-yellow-100 text-yellow-700 text-[9px] px-1.5 py-0.5 rounded mt-1">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium">
                      {lap.brand || "-"}
                    </td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm">
                      {lap.model || "-"}
                    </td>
                    <td className="p-2 sm:p-3 text-xs sm:text-sm font-bold text-blue-600 whitespace-nowrap">
                      {formatPrice(lap.price)}
                    </td>
                    <td className="p-2 sm:p-3 text-xs hidden md:table-cell">
                      <div className="flex items-center gap-1">
                        <FiCpu size={12} className="text-gray-400" />
                        <span>
                          {lap.processor?.split(" ").slice(0, 2).join(" ") ||
                            "-"}
                        </span>
                      </div>
                      {lap.generation && (
                        <span className="text-[10px] text-gray-400 block">
                          {lap.generation}
                        </span>
                      )}
                    </td>
                    <td className="p-2 sm:p-3 text-xs hidden lg:table-cell">
                      <div className="space-y-0.5">
                        {lap.ram && (
                          <div className="flex items-center gap-1">
                            <FiDatabase size={10} className="text-gray-400" />
                            <span>{lap.ram}</span>
                          </div>
                        )}
                        {lap.storage && (
                          <div className="flex items-center gap-1">
                            <FiHardDrive size={10} className="text-gray-400" />
                            <span>{lap.storage}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-2 sm:p-3">{getStockBadge(lap.stock)}</td>
                    <td className="p-2 sm:p-3">{getStatusBadge(lap.status)}</td>
                    <td className="p-2 sm:p-3">
                      <div className="flex gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleDelete(lap._id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded transition"
                          title="Delete"
                        >
                          <FiTrash2 size={12} />
                        </button>
                        <button
                          onClick={() => handleEdit(lap._id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white p-1.5 rounded transition"
                          title="Edit"
                        >
                          <FiEdit2 size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(lap._id)}
                        onChange={() => handleSelectProduct(lap._id)}
                        className="w-4 h-4 cursor-pointer"
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-8 sm:py-12">
                    <div className="text-gray-500 text-sm sm:text-base">
                      {searchTerm
                        ? `No products found for "${searchTerm}"`
                        : "No products found. Click 'Add Laptop' to add your first product."}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      {filteredLaptops.length > 0 && (
        <div className="mt-4 text-xs sm:text-sm text-gray-500 flex flex-wrap justify-between items-center gap-2">
          <div className="flex gap-3">
            <span>
              Total:{" "}
              <strong className="text-gray-700">
                {filteredLaptops.length}
              </strong>{" "}
              products
            </span>
            <span>
              In Stock:{" "}
              <strong className="text-green-700">
                {filteredLaptops.filter((p) => p.stock > 0).length}
              </strong>
            </span>
            <span>
              Out of Stock:{" "}
              <strong className="text-red-700">
                {filteredLaptops.filter((p) => p.stock <= 0).length}
              </strong>
            </span>
          </div>
          {selectedProducts.length > 0 && (
            <span className="text-blue-600 font-medium">
              Selected: {selectedProducts.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
