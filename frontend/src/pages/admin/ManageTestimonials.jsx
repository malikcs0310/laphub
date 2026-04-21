import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiX,
  FiStar,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiUser,
  FiMapPin,
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
      if (response.ok) {
        setTestimonials(data.testimonials || []);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load testimonials");
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
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update");
    }
  };

  const deleteTestimonial = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/testimonials/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Testimonial deleted successfully");
        fetchTestimonials();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      toast.error("Failed to delete");
    }
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`text-[9px] sm:text-xs ${
              star <= rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Manage Customer Testimonials
      </h1>

      {/* Testimonials Table - Horizontal scroll on mobile */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] sm:min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  City
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Rating
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Review
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Featured
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {testimonials.length > 0 ? (
                testimonials.map((testimonial) => (
                  <tr key={testimonial._id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <FiUser
                          size={10}
                          className="sm:w-3 sm:h-3 text-gray-400"
                        />
                        <span className="text-[10px] sm:text-xs font-medium text-gray-900">
                          {testimonial.name?.length > 20
                            ? `${testimonial.name.substring(0, 20)}...`
                            : testimonial.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex items-center gap-1 sm:gap-1.5">
                        <FiMapPin
                          size={8}
                          className="sm:w-2.5 sm:h-2.5 text-gray-400"
                        />
                        <span className="text-[10px] sm:text-xs text-gray-600">
                          {testimonial.city}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <StarRating rating={testimonial.rating} />
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-[10px] sm:text-xs text-gray-600 max-w-[180px] sm:max-w-[300px] truncate">
                      {testimonial.comment}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${
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
                    <td className="px-3 sm:px-4 py-3">
                      <button
                        onClick={() =>
                          updateStatus(
                            testimonial._id,
                            testimonial.status,
                            !testimonial.featured,
                          )
                        }
                        className={`p-1 rounded transition ${
                          testimonial.featured
                            ? "text-yellow-600 hover:bg-yellow-50"
                            : "text-gray-400 hover:bg-gray-100"
                        }`}
                        title={testimonial.featured ? "Unfeature" : "Feature"}
                      >
                        {testimonial.featured ? (
                          <FiEye size={14} className="sm:w-4 sm:h-4" />
                        ) : (
                          <FiEyeOff size={14} className="sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {testimonial.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(testimonial._id, "approved")
                              }
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition"
                              title="Approve"
                            >
                              <FiCheck size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(testimonial._id, "rejected")
                              }
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                              title="Reject"
                            >
                              <FiX size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteTestimonial(testimonial._id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <FiTrash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                      No testimonials found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageTestimonials;
