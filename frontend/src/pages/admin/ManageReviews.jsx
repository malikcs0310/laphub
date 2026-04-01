import React, { useState, useEffect } from "react";
import { FiCheck, FiX, FiMessageSquare, FiTrash2 } from "react-icons/fi";
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
      if (response.ok) setReviews(data.reviews);
    } catch (error) {
      console.error("Error:", error);
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
      }
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const deleteReview = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/reviews/admin/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        toast.success("Review deleted");
        fetchReviews();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Manage Product Reviews
      </h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                User
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {reviews.map((review) => (
              <tr key={review._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900 max-w-[200px] truncate">
                  {review.productId?.title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {review.userName}
                </td>
                <td className="px-4 py-3 text-sm text-yellow-500">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-[300px] truncate">
                  {review.comment}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {review.status === "pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(review._id, "approved")}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Approve"
                        >
                          <FiCheck size={18} />
                        </button>
                        <button
                          onClick={() => updateStatus(review._id, "rejected")}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Reject"
                        >
                          <FiX size={18} />
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
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                      title="Reply"
                    >
                      <FiMessageSquare size={18} />
                    </button>
                    <button
                      onClick={() => deleteReview(review._id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
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

      {/* Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Reply to Review</h3>
            <textarea
              rows="4"
              value={replyModal.reply}
              onChange={(e) =>
                setReplyModal({ ...replyModal, reply: e.target.value })
              }
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Write your response..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() =>
                  setReplyModal({ open: false, reviewId: null, reply: "" })
                }
                className="px-4 py-2 bg-gray-200 rounded-lg"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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
