import React, { useState, useEffect } from "react";
import {
  FiStar,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiSmile,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { MdStar } from "react-icons/md";
import toast from "react-hot-toast";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    rating: 5,
    comment: "",
    laptop: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    if (testimonials.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length, isPaused]);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/api/testimonials`);
      const data = await response.json();
      if (response.ok) {
        setTestimonials(data.testimonials);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(`${API_URL}/api/testimonials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(
          "Thank you! Your testimonial will appear after approval.",
        );
        setShowForm(false);
        setFormData({
          name: "",
          email: "",
          city: "",
          rating: 5,
          comment: "",
          laptop: "",
        });
        fetchTestimonials();
      } else {
        toast.error(data.message || "Failed to submit");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const nextSlide = () => {
    setIsPaused(true);
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsPaused(false), 10000);
  };

  const prevSlide = () => {
    setIsPaused(true);
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
    setTimeout(() => setIsPaused(false), 10000);
  };

  const formatDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-PK", {
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="py-16 sm:py-20 text-center">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }

  // If no testimonials yet, show empty state
  if (testimonials.length === 0) {
    return (
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-full shadow-sm mb-3 sm:mb-4">
              <FiSmile className="text-yellow-500 mr-1 sm:mr-2" size={14} />
              <span className="text-gray-700 text-xs sm:text-sm font-semibold">
                Real Reviews
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
              What Our Customers Say
            </h2>
            <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
              Be the first to share your experience with LapHub.pk!
            </p>
          </div>

          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 md:p-10">
              <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🌟</div>
              <p className="text-gray-500 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
                No testimonials yet. Share your experience and help others find
                their perfect laptop!
              </p>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold transition text-sm sm:text-base"
              >
                Share Your Experience
              </button>
            </div>
          </div>

          {/* Testimonial Form - Mobile Optimized */}
          {showForm && (
            <div className="max-w-2xl mx-auto mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-8">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Share Your Experience
              </h3>
              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Laptop Purchased
                    </label>
                    <input
                      type="text"
                      value={formData.laptop}
                      onChange={(e) =>
                        setFormData({ ...formData, laptop: e.target.value })
                      }
                      className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="e.g., Dell Latitude"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, rating: star })
                        }
                        className={`text-xl sm:text-2xl ${star <= formData.rating ? "text-yellow-400" : "text-gray-300"} hover:scale-110 transition`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    rows={4}
                    value={formData.comment}
                    onChange={(e) =>
                      setFormData({ ...formData, comment: e.target.value })
                    }
                    className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Tell us about your experience with LapHub.pk..."
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                >
                  <FiSend size={14} />
                  {submitting ? "Submitting..." : "Submit Testimonial"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white rounded-full shadow-sm mb-3 sm:mb-4">
            <FiSmile className="text-yellow-500 mr-1 sm:mr-2" size={14} />
            <span className="text-gray-700 text-xs sm:text-sm font-semibold">
              Real Reviews
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Don't just take our word for it - here's what our happy customers
            have to say
          </p>
        </div>

        {/* Testimonial Slider - Mobile Optimized */}
        <div
          className="max-w-4xl mx-auto relative px-8 sm:px-0"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Previous Button - Hidden on very small */}
          <button
            onClick={prevSlide}
            className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 bg-white/80 hover:bg-white text-gray-600 p-1.5 sm:p-2 rounded-full shadow-lg z-10 transition"
          >
            <FiChevronLeft size={18} className="sm:w-5 sm:h-5" />
          </button>

          {/* Next Button - Hidden on very small */}
          <button
            onClick={nextSlide}
            className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 bg-white/80 hover:bg-white text-gray-600 p-1.5 sm:p-2 rounded-full shadow-lg z-10 transition"
          >
            <FiChevronRight size={18} className="sm:w-5 sm:h-5" />
          </button>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-8 md:p-10 transition-all duration-500">
            <div className="text-center">
              {/* Stars */}
              <div className="flex justify-center mb-3 sm:mb-4">
                {[...Array(testimonials[currentTestimonial]?.rating || 5)].map(
                  (_, i) => (
                    <MdStar
                      key={i}
                      className="text-yellow-400 text-lg sm:text-2xl"
                    />
                  ),
                )}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-sm sm:text-base md:text-xl leading-relaxed mb-4 sm:mb-6 italic line-clamp-4 sm:line-clamp-none">
                "{testimonials[currentTestimonial]?.comment}"
              </p>

              {/* Customer Info */}
              <div>
                <p className="font-bold text-gray-900 text-base sm:text-lg">
                  {testimonials[currentTestimonial]?.name}
                </p>
                <div className="flex items-center justify-center gap-1 text-gray-500 text-xs sm:text-sm mt-0.5 sm:mt-0">
                  <FiMapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>{testimonials[currentTestimonial]?.city}</span>
                  <span>•</span>
                  <span>
                    {testimonials[currentTestimonial]?.laptop || "Laptop"}
                  </span>
                </div>
                <p className="text-gray-400 text-[10px] sm:text-xs mt-1">
                  {formatDate()}
                </p>
              </div>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-1.5 sm:gap-2 mt-4 sm:mt-6">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setIsPaused(true);
                    setCurrentTestimonial(idx);
                    setTimeout(() => setIsPaused(false), 10000);
                  }}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    currentTestimonial === idx
                      ? "w-4 sm:w-6 bg-blue-600"
                      : "w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Trust Badge */}
          <div className="text-center mt-6 sm:mt-8">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-50 text-green-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full">
              <FiCheckCircle size={12} className="sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-sm font-medium">
                100% Genuine Reviews • {testimonials.length}+ Happy Customers
              </span>
            </div>
          </div>

          {/* Share Your Experience Button */}
          <div className="text-center mt-6 sm:mt-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold transition text-sm sm:text-base"
            >
              {showForm ? "Cancel" : "Share Your Experience"}
            </button>
          </div>
        </div>
      </div>

      {/* Testimonial Form - Mobile Optimized */}
      {showForm && (
        <div className="max-w-2xl mx-auto mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
            Share Your Experience
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Laptop Purchased
                </label>
                <input
                  type="text"
                  value={formData.laptop}
                  onChange={(e) =>
                    setFormData({ ...formData, laptop: e.target.value })
                  }
                  className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g., Dell Latitude"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className={`text-xl sm:text-2xl ${star <= formData.rating ? "text-yellow-400" : "text-gray-300"} hover:scale-110 transition`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                rows={4}
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Tell us about your experience with LapHub.pk..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
            >
              <FiSend size={14} />
              {submitting ? "Submitting..." : "Submit Testimonial"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
