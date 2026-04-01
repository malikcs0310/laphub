import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiX,
  FiStar,
  FiTrash2,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import toast from "react-hot-toast";

const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/testimonials/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) setTestimonials(data.testimonials);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, featured = null) => {
    try {
      const token = localStorage.getItem("adminToken");
      const body = { status };
      if (featured !== null) body.featured = featured;
      const response = await fetch(`${API_URL}/api/testimonials/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        toast.success(`Testimonial ${status}`);
        fetchTestimonials();
      }
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const deleteTestimonial = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/testimonials/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Testimonial deleted");
        fetchTestimonials();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Manage Customer Testimonials
      </h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                City
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Rating
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Review
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Featured
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {testimonials.map((testimonial) => (
              <tr key={testimonial._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">
                  {testimonial.name}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {testimonial.city}
                </td>
                <td className="px-4 py-3 text-sm text-yellow-500">
                  {"★".repeat(testimonial.rating)}
                  {"☆".repeat(5 - testimonial.rating)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[300px] truncate">
                  {testimonial.comment}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      testimonial.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : testimonial.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {testimonial.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() =>
                      updateStatus(
                        testimonial._id,
                        testimonial.status,
                        !testimonial.featured,
                      )
                    }
                    className={`p-1 rounded ${testimonial.featured ? "text-yellow-600" : "text-gray-400"}`}
                  >
                    {testimonial.featured ? (
                      <FiEye size={18} />
                    ) : (
                      <FiEyeOff size={18} />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {testimonial.status === "pending" && (
                      <>
                        <button
                          onClick={() =>
                            updateStatus(testimonial._id, "approved")
                          }
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={() =>
                            updateStatus(testimonial._id, "rejected")
                          }
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <FiX size={18} />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteTestimonial(testimonial._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageTestimonials;
