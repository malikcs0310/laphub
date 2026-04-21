import React, { useState, useEffect } from "react";
import {
  FiStar,
  FiThumbsUp,
  FiThumbsDown,
  FiFlag,
  FiCheckCircle,
} from "react-icons/fi";
import toast from "react-hot-toast";

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    rating: 5,
    title: "",
    comment: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [userHasPurchased, setUserHasPurchased] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchReviews = async (reset = false) => {
    try {
      const response = await fetch(
        `${API_URL}/api/reviews/product/${productId}?page=${page}&limit=10`,
      );
      const data = await response.json();
      if (response.ok) {
        if (reset) {
          setReviews(data.reviews);
        } else {
          setReviews((prev) => [...prev, ...data.reviews]);
        }
        setRatingStats(data.ratingStats);
        setHasMore(data.reviews.length === 10);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Temporary test data
    const testReviews = [
      {
        _id: "1",
        userName: "Muhammad Usama",
        rating: 5,
        title: "Excellent Laptop!",
        comment: "Best laptop I've ever used. Performance is amazing.",
        verifiedPurchase: true,
        helpful: 12,
        notHelpful: 1,
        createdAt: "2026-03-25T10:00:00.000Z",
      },
      {
        _id: "2",
        userName: "Sara Khan",
        rating: 4,
        title: "Good Value for Money",
        comment: "Satisfied with the purchase. Works well for my daily tasks.",
        verifiedPurchase: true,
        helpful: 8,
        notHelpful: 0,
        createdAt: "2026-03-20T14:30:00.000Z",
      },
    ];
    setReviews(testReviews);
    setRatingStats({
      average: 4.5,
      total: 2,
      distribution: { 5: 1, 4: 1, 3: 0, 2: 0, 1: 0 },
    });
    setLoading(false);
  }, [productId]);
  useEffect(() => {
    fetchReviews(true);
  }, [productId]);

  const handleMarkHelpful = async (reviewId, type) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to mark reviews");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/reviews/${reviewId}/helpful`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setReviews(
          reviews.map((r) =>
            r._id === reviewId
              ? { ...r, helpful: data.helpful, notHelpful: data.notHelpful }
              : r,
          ),
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, ...newReview }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Review submitted! It will appear after admin approval.");
        setShowReviewForm(false);
        setNewReview({ rating: 5, title: "", comment: "" });
        fetchReviews(true);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, readonly = false }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => !readonly && onRatingChange(star)}
            className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} ${!readonly && "hover:scale-110 transition"}`}
            disabled={readonly}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (loading && page === 1) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">
        Customer Reviews
      </h3>

      {/* Rating Summary */}
      {ratingStats && ratingStats.total > 0 && (
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">
                {ratingStats.average.toFixed(1)}
              </div>
              <div className="flex justify-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar
                    key={star}
                    className={`text-xl ${star <= Math.round(ratingStats.average) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {ratingStats.total} reviews
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = ratingStats.distribution[star] || 0;
                const percentage =
                  ratingStats.total > 0 ? (count / ratingStats.total) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-8">{star}★</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-12">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Write Review Button */}
      <div className="mb-8">
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          {showReviewForm ? "Cancel" : "Write a Review"}
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white border rounded-xl p-6 mb-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Write Your Review
          </h4>
          <form onSubmit={handleSubmitReview}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating
              </label>
              <StarRating
                rating={newReview.rating}
                onRatingChange={(r) =>
                  setNewReview({ ...newReview, rating: r })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review Title
              </label>
              <input
                type="text"
                value={newReview.title}
                onChange={(e) =>
                  setNewReview({ ...newReview, title: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Summarize your experience"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                rows="4"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Share your experience with this laptop"
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b pb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  {review.userName?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.userName}
                  </p>
                  <StarRating rating={review.rating} readonly={true} />
                </div>
              </div>
              {review.verifiedPurchase && (
                <span className="flex items-center gap-1 text-green-600 text-sm bg-green-50 px-2 py-1 rounded-full">
                  <FiCheckCircle size={14} />
                  Verified Purchase
                </span>
              )}
            </div>
            <h4 className="font-semibold text-gray-900 mt-2">{review.title}</h4>
            <p className="text-gray-600 mt-2">{review.comment}</p>
            <div className="flex items-center gap-4 mt-4">
              <button
                onClick={() => handleMarkHelpful(review._id, "helpful")}
                className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition"
              >
                <FiThumbsUp size={16} />
                <span className="text-sm">{review.helpful || 0}</span>
              </button>
              <button
                onClick={() => handleMarkHelpful(review._id, "notHelpful")}
                className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition"
              >
                <FiThumbsDown size={16} />
                <span className="text-sm">{review.notHelpful || 0}</span>
              </button>
            </div>
            {review.reply?.text && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-semibold text-gray-700">
                  LapHub.pk Response:
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {review.reply.text}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={() => setPage((p) => p + 1)}
            className="text-blue-600 hover:text-blue-700"
          >
            Load More Reviews
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
