import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiSearch,
  FiRefreshCw,
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

      if (Array.isArray(data)) {
        setLaptops(data);
      } else {
        setLaptops(data.data || []);
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
      lap.model?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatPrice = (price) => `Rs ${Number(price).toLocaleString()}`;

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
      <div className="sticky top-0 sm:top-20 z-20 bg-gray-100/95 backdrop-blur border-b border-gray-200 pb-3 sm:pb-4 pt-2 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-xl sm:text-2xl font-bold">Admin Products</h2>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/admin/add-laptop")}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition flex items-center gap-1.5 text-sm"
            >
              <FiPlus size={14} />
              Add Laptop
            </button>

            {/* Delete Selected Button - Only shows when at least one product is selected */}
            {selectedProducts.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition flex items-center gap-1.5 text-sm"
              >
                <FiTrash2 size={14} />
                Delete Selected ({selectedProducts.length})
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
              placeholder="Search by title, brand, or model..."
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

      {/* Products Table - Horizontal scroll on mobile */}
      <div className="overflow-x-auto bg-white rounded-lg sm:rounded-xl shadow">
        <table className="w-full min-w-[800px] sm:min-w-full text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-2 sm:p-3 text-center">#</th>
              <th className="p-2 sm:p-3">Image</th>
              <th className="p-2 sm:p-3">Title</th>
              <th className="p-2 sm:p-3">Brand</th>
              <th className="p-2 sm:p-3">Model</th>
              <th className="p-2 sm:p-3">Price</th>
              <th className="p-2 sm:p-3 hidden xs:table-cell">RAM</th>
              <th className="p-2 sm:p-3 hidden xs:table-cell">Storage</th>
              <th className="p-2 sm:p-3">Actions</th>
              <th className="p-2 sm:p-3 text-center">
                <input
                  type="checkbox"
                  checked={
                    filteredLaptops.length > 0 &&
                    selectedProducts.length === filteredLaptops.length
                  }
                  onChange={handleSelectAll}
                  className="w-4 h-4"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLaptops.length > 0 ? (
              filteredLaptops.map((lap, index) => (
                <tr key={lap._id} className="border-b hover:bg-gray-50">
                  <td className="p-2 sm:p-3 font-medium text-center text-xs sm:text-sm">
                    {index + 1}
                  </td>
                  <td className="p-2 sm:p-3">
                    {lap.images && lap.images.length > 0 ? (
                      <img
                        src={`${API_URL}/uploads/${lap.images[0]}`}
                        alt="laptop"
                        className="w-12 h-10 sm:w-16 sm:h-12 object-cover rounded"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-12 h-10 sm:w-16 sm:h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">
                    {lap.title.length > 30
                      ? `${lap.title.substring(0, 30)}...`
                      : lap.title}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">{lap.brand}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm">{lap.model}</td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium text-blue-600">
                    {formatPrice(lap.price)}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm hidden xs:table-cell">
                    {lap.ram || "-"}
                  </td>
                  <td className="p-2 sm:p-3 text-xs sm:text-sm hidden xs:table-cell">
                    {lap.storage || "-"}
                  </td>
                  <td className="p-2 sm:p-3">
                    <div className="flex gap-1.5 sm:gap-2">
                      <button
                        onClick={() => handleDelete(lap._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded transition text-xs"
                      >
                        <FiTrash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/admin/edit-laptop/${lap._id}`)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-1 rounded transition text-xs"
                      >
                        <FiEdit2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(lap._id)}
                      onChange={() => handleSelectProduct(lap._id)}
                      className="w-4 h-4"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-8 sm:py-12">
                  <div className="text-gray-500 text-sm sm:text-base">
                    {searchTerm
                      ? `No products found for "${searchTerm}"`
                      : "No products found"}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      {filteredLaptops.length > 0 && (
        <div className="mt-4 text-xs sm:text-sm text-gray-500 flex flex-wrap justify-between items-center gap-2">
          <span>Total products: {filteredLaptops.length}</span>
          {selectedProducts.length > 0 && (
            <span className="text-blue-600">
              Selected: {selectedProducts.length}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewProducts;
