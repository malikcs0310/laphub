import React, { useState, useEffect } from "react";
import {
  FiCheck,
  FiX,
  FiMessageSquare,
  FiTrash2,
  FiStar,
} from "react-icons/fi";
import toast from "react-hot-toast";

const ManageReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyModal, setReplyModal] = useState({
    open: false,
    reviewId: null,
    reply: "",
  });

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/reviews/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status, reply = "") => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/reviews/admin/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, reply }),
      });
      if (response.ok) {
        toast.success(`Review ${status}`);
        fetchReviews();
        setReplyModal({ open: false, reviewId: null, reply: "" });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update review");
    }
  };

  const deleteReview = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/reviews/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Review deleted successfully");
        fetchReviews();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Failed to delete review");
    }
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`text-[10px] sm:text-xs ${
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
        Manage Product Reviews
      </h1>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] sm:min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  User
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
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-3 text-[10px] sm:text-xs text-gray-900 max-w-[120px] sm:max-w-[200px] truncate">
                      {review.productId?.title || "N/A"}
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-[10px] sm:text-xs text-gray-600">
                      {review.userName}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <StarRating rating={review.rating} />
                    </td>
                    <td className="px-3 sm:px-4 py-3 text-[10px] sm:text-xs text-gray-600 max-w-[200px] sm:max-w-[300px] truncate">
                      {review.comment}
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${
                          review.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : review.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                        }`}
                      >
                        {review.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 py-3">
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        {review.status === "pending" && (
                          <>
                            <button
                              onClick={() =>
                                updateStatus(review._id, "approved")
                              }
                              className="p-1 text-green-600 hover:bg-green-50 rounded transition"
                              title="Approve"
                            >
                              <FiCheck size={14} className="sm:w-4 sm:h-4" />
                            </button>
                            <button
                              onClick={() =>
                                updateStatus(review._id, "rejected")
                              }
                              className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                              title="Reject"
                            >
                              <FiX size={14} className="sm:w-4 sm:h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() =>
                            setReplyModal({
                              open: true,
                              reviewId: review._id,
                              reply: review.reply?.text || "",
                            })
                          }
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Reply"
                        >
                          <FiMessageSquare
                            size={14}
                            className="sm:w-4 sm:h-4"
                          />
                        </button>
                        <button
                          onClick={() => deleteReview(review._id)}
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
                  <td colSpan="6" className="text-center py-8">
                    <p className="text-gray-500 text-sm">No reviews found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 sm:p-6 w-full max-w-md">
            <h3 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
              Reply to Review
            </h3>
            <textarea
              rows={4}
              value={replyModal.reply}
              onChange={(e) =>
                setReplyModal({ ...replyModal, reply: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg p-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your response..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setReplyModal({ open: false, reviewId: null, reply: "" })
                }
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  updateStatus(
                    replyModal.reviewId,
                    "approved",
                    replyModal.reply,
                  )
                }
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageReviews;
