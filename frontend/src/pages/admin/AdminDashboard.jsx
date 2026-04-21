import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiTruck,
  FiXCircle,
  FiStar,
  FiMessageCircle,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
  });
  const [reviewStats, setReviewStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    averageRating: 0,
  });
  const [testimonialStats, setTestimonialStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [recentTestimonials, setRecentTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchDashboardData();
    fetchReviewData();
    fetchTestimonialData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/orders/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    }
  };

  const fetchReviewData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/reviews/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const reviews = data.reviews || [];
        const pending = reviews.filter((r) => r.status === "pending").length;
        const approved = reviews.filter((r) => r.status === "approved").length;
        const avgRating =
          approved > 0
            ? reviews
                .filter((r) => r.status === "approved")
                .reduce((sum, r) => sum + r.rating, 0) / approved
            : 0;
        setReviewStats({
          total: reviews.length,
          pending,
          approved,
          averageRating: avgRating.toFixed(1),
        });
        setRecentReviews(reviews.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching review data:", error);
    }
  };

  const fetchTestimonialData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/testimonials/admin/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        const testimonials = data.testimonials || [];
        const pending = testimonials.filter(
          (t) => t.status === "pending",
        ).length;
        const approved = testimonials.filter(
          (t) => t.status === "approved",
        ).length;
        setTestimonialStats({
          total: testimonials.length,
          pending,
          approved,
        });
        setRecentTestimonials(testimonials.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching testimonial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => `Rs ${Number(price).toLocaleString()}`;
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
    });

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const StarRating = ({ rating }) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={`text-[9px] sm:text-xs ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
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
        Admin Dashboard
      </h1>

      {/* Orders Stats Cards - 2 columns on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Total Orders
              </p>
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                {stats.totalOrders}
              </p>
            </div>
            <div className="bg-blue-100 p-1.5 sm:p-2 md:p-3 rounded-full">
              <FiPackage className="text-blue-600 text-sm sm:text-base md:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Total Revenue
              </p>
              <p className="text-xs sm:text-sm md:text-base lg:text-xl font-bold text-green-600 break-words">
                {formatPrice(stats.totalRevenue)}
              </p>
            </div>
            <div className="bg-green-100 p-1.5 sm:p-2 md:p-3 rounded-full">
              <FiDollarSign className="text-green-600 text-sm sm:text-base md:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Pending Orders
              </p>
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-yellow-600">
                {stats.pendingOrders}
              </p>
            </div>
            <div className="bg-yellow-100 p-1.5 sm:p-2 md:p-3 rounded-full">
              <FiClock className="text-yellow-600 text-sm sm:text-base md:text-xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-500">Delivered</p>
              <p className="text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-green-600">
                {stats.deliveredOrders}
              </p>
            </div>
            <div className="bg-green-100 p-1.5 sm:p-2 md:p-3 rounded-full">
              <FiCheckCircle className="text-green-600 text-sm sm:text-base md:text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Testimonials Stats - Stack on mobile */}
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Reviews Stats Card */}
        <div className="flex-1 bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FiStar className="text-yellow-500 text-base sm:text-xl" />
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                Product Reviews
              </h2>
            </div>
            <Link
              to="/admin/reviews"
              className="text-blue-600 hover:underline text-[10px] sm:text-xs md:text-sm"
            >
              Manage
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {reviewStats.total}
              </p>
              <p className="text-[9px] sm:text-xs text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">
                {reviewStats.pending}
              </p>
              <p className="text-[9px] sm:text-xs text-gray-500">Pending</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                {reviewStats.approved}
              </p>
              <p className="text-[9px] sm:text-xs text-gray-500">Approved</p>
            </div>
          </div>
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs text-gray-500">
                Average Rating
              </span>
              <div className="flex items-center gap-1 sm:gap-2">
                <StarRating rating={parseFloat(reviewStats.averageRating)} />
                <span className="text-[10px] sm:text-xs font-semibold text-gray-700">
                  {reviewStats.averageRating}
                </span>
              </div>
            </div>
          </div>

          {recentReviews.length > 0 && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
              <p className="text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                Recent Reviews
              </p>
              <div className="space-y-1.5 sm:space-y-2">
                {recentReviews.map((review) => (
                  <div
                    key={review._id}
                    className="flex items-center justify-between text-[10px] sm:text-xs"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                        {review.userName}
                      </p>
                      <StarRating rating={review.rating} />
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] ${
                        review.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : review.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {review.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Testimonials Stats Card */}
        <div className="flex-1 bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <FiMessageCircle className="text-purple-500 text-base sm:text-xl" />
              <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                Customer Testimonials
              </h2>
            </div>
            <Link
              to="/admin/testimonials"
              className="text-blue-600 hover:underline text-[10px] sm:text-xs md:text-sm"
            >
              Manage
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                {testimonialStats.total}
              </p>
              <p className="text-[9px] sm:text-xs text-gray-500">Total</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-600">
                {testimonialStats.pending}
              </p>
              <p className="text-[9px] sm:text-xs text-gray-500">Pending</p>
            </div>
            <div>
              <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                {testimonialStats.approved}
              </p>
              <p className="text-[9px] sm:text-xs text-gray-500">Approved</p>
            </div>
          </div>

          {recentTestimonials.length > 0 && (
            <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
              <p className="text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-2">
                Recent Testimonials
              </p>
              <div className="space-y-1.5 sm:space-y-2">
                {recentTestimonials.map((testimonial) => (
                  <div
                    key={testimonial._id}
                    className="flex items-center justify-between text-[10px] sm:text-xs"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        {testimonial.name}
                      </p>
                      <p className="text-[8px] sm:text-[10px] text-gray-500 truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px]">
                        {testimonial.comment?.slice(0, 35)}...
                      </p>
                    </div>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] ${
                        testimonial.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : testimonial.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {testimonial.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm p-4 sm:p-6">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
            Recent Orders
          </h2>
          <Link
            to="/admin/orders"
            className="text-blue-600 hover:underline text-[10px] sm:text-xs md:text-sm"
          >
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] sm:min-w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left py-2 sm:py-3 text-[10px] sm:text-xs font-medium text-gray-500">
                  Order ID
                </th>
                <th className="text-left py-2 sm:py-3 text-[10px] sm:text-xs font-medium text-gray-500">
                  Customer
                </th>
                <th className="text-left py-2 sm:py-3 text-[10px] sm:text-xs font-medium text-gray-500">
                  Date
                </th>
                <th className="text-left py-2 sm:py-3 text-[10px] sm:text-xs font-medium text-gray-500">
                  Total
                </th>
                <th className="text-left py-2 sm:py-3 text-[10px] sm:text-xs font-medium text-gray-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b last:border-0 hover:bg-gray-50"
                >
                  <td className="py-2 sm:py-3">
                    <Link
                      to={`/admin/orders/${order._id}`}
                      className="text-blue-600 hover:underline text-[10px] sm:text-xs"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="py-2 sm:py-3 text-[10px] sm:text-xs">
                    {order.customer?.name?.split(" ")[0] ||
                      order.customer?.name}
                  </td>
                  <td className="py-2 sm:py-3 text-[10px] sm:text-xs">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-2 sm:py-3 text-[10px] sm:text-xs font-semibold">
                    {formatPrice(order.total)}
                  </td>
                  <td className="py-2 sm:py-3">
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-medium ${statusColors[order.orderStatus]}`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
