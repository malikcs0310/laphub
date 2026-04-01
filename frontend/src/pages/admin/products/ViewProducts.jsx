import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

const ViewProducts = () => {
  const [laptops, setLaptops] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const navigate = useNavigate();

  const fetchLaptops = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/laptops");
      const data = await res.json();

      if (Array.isArray(data)) {
        setLaptops(data);
      } else {
        setLaptops(data.data || []);
      }
    } catch (error) {
      console.log("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await fetch(`http://localhost:5000/api/laptops/${id}`, {
        method: "DELETE",
      });

      fetchLaptops();
    } catch (error) {
      console.log("Delete error:", error);
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
    if (selectedProducts.length === laptops.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(laptops.map((lap) => lap._id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product");
      return;
    }

    if (!window.confirm("Are you sure you want to delete selected products?")) {
      return;
    }

    try {
      await Promise.all(
        selectedProducts.map((id) =>
          fetch(`http://localhost:5000/api/laptops/${id}`, {
            method: "DELETE",
          }),
        ),
      );

      alert("Selected products deleted successfully");
      setSelectedProducts([]);
      fetchLaptops();
    } catch (error) {
      console.log("Bulk delete error:", error);
      alert("Failed to delete selected products");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="sticky top-20 z-20 bg-gray-100/95 backdrop-blur border-b border-gray-200 pb-4 pt-2 mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Products</h2>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/admin/add-laptop")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Add Laptop
          </button>

          <button
            onClick={handleBulkDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Delete Selected
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Model</th>
              <th className="p-3">Price</th>
              <th className="p-3">RAM</th>
              <th className="p-3">Storage</th>
              <th className="p-3">Actions</th>
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={
                    laptops.length > 0 &&
                    selectedProducts.length === laptops.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
            </tr>
          </thead>

          <tbody>
            {laptops.length > 0 ? (
              laptops.map((lap, index) => (
                <tr key={lap._id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{index + 1}</td>

                  <td className="p-3">
                    {lap.images && lap.images.length > 0 && (
                      <img
                        src={`http://localhost:5000/uploads/${lap.images[0]}`}
                        alt="laptop"
                        className="w-16 h-12 object-cover rounded"
                      />
                    )}
                  </td>

                  <td className="p-3">{lap.title}</td>
                  <td className="p-3">{lap.brand}</td>
                  <td className="p-3">{lap.model}</td>
                  <td className="p-3">Rs {lap.price}</td>
                  <td className="p-3">{lap.ram}</td>
                  <td className="p-3">{lap.storage}</td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleDelete(lap._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => navigate(`/admin/edit-laptop/${lap._id}`)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </td>

                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(lap._id)}
                      onChange={() => handleSelectProduct(lap._id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center p-4">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewProducts;
