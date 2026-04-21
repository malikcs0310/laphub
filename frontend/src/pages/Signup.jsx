import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { MdLaptop } from "react-icons/md";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^03\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid Pakistani number (03xxxxxxxxx)";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const { confirmPassword, ...signupData } = formData;
    const result = await signup(signupData);

    setIsSubmitting(false);

    if (result.success) {
      navigate("/");
    } else {
      setErrors({ submit: result.error || "Signup failed. Please try again." });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 px-3 sm:px-4 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Logo - Mobile Optimized */}
        <div className="text-center mb-6 sm:mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 sm:space-x-3"
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
              <MdLaptop className="text-white text-xl sm:text-2xl md:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                LapHub.pk
              </h1>
              <p className="text-[10px] sm:text-xs text-gray-500">
                Create your account
              </p>
            </div>
          </Link>
        </div>

        {/* Signup Form - Mobile Optimized */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            Create Account
          </h2>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start text-red-600">
              <FiAlertCircle className="mr-2 flex-shrink-0 mt-0.5 text-sm sm:text-base" />
              <span className="text-xs sm:text-sm">{errors.submit}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Full Name */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition text-sm sm:text-base ${
                    errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="Enter your full name"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition text-sm sm:text-base ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Phone Number
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition text-sm sm:text-base ${
                    errors.phone
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="03xxxxxxxxx"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition text-sm sm:text-base ${
                    errors.password
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <FiEyeOff size={16} className="sm:w-5 sm:h-5" />
                  ) : (
                    <FiEye size={16} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
              <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
                Password must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm sm:text-base" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2 sm:py-3 border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 transition text-sm sm:text-base ${
                    errors.confirmPassword
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={16} className="sm:w-5 sm:h-5" />
                  ) : (
                    <FiEye size={16} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-0.5 sm:mt-1 mr-2 sm:mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="terms"
                className="text-[10px] sm:text-xs text-gray-600"
              >
                I agree to the{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-5 sm:mt-6 text-center text-gray-600 text-xs sm:text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Benefits - Mobile Optimized */}
        <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div className="text-[10px] sm:text-xs text-gray-500">
            <FiCheckCircle className="mx-auto mb-1 text-green-500 text-xs sm:text-sm" />
            Free Shipping
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500">
            <FiCheckCircle className="mx-auto mb-1 text-green-500 text-xs sm:text-sm" />
            1 Year Warranty
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500">
            <FiCheckCircle className="mx-auto mb-1 text-green-500 text-xs sm:text-sm" />
            24/7 Support
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
