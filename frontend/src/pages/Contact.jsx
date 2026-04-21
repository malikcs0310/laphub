import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { sendContactMessage } from "../services/contactService";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiMessageSquare,
  FiClock,
} from "react-icons/fi";
import { MdSupportAgent, MdWhatsapp, MdLocationOn } from "react-icons/md";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await sendContactMessage(formData);
      setSuccessMessage(
        "Your message has been sent successfully! We'll get back to you soon.",
      );
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setErrorMessage(error);
      toast.error(error || "Failed to send message");
    }

    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - LapHub.pk | Get Support & Assistance</title>
        <meta
          name="description"
          content="Have questions about laptops or need assistance? Contact LapHub.pk for expert advice, support, and inquiries."
        />
        <meta
          name="keywords"
          content="contact laphub, laptop support, laptop assistance, tech support pakistan"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 py-8 sm:py-12 px-3 sm:px-4">
        {/* Hero Section - Mobile Optimized */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 rounded-full mb-3 sm:mb-4">
            <MdSupportAgent
              className="text-blue-600 mr-1 sm:mr-2"
              size={14}
              className="sm:w-4 sm:h-4"
            />
            <span className="text-blue-600 text-[10px] sm:text-sm font-semibold">
              We're Here to Help
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
            Get In Touch
          </h1>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Have questions about laptops or need assistance with your purchase?
            Our expert team is ready to help you find the perfect laptop.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6 sm:gap-8">
            {/* Left Side - Contact Info */}
            <div className="md:w-1/3 space-y-5 sm:space-y-6">
              {/* Contact Info Card */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                    <MdSupportAgent className="text-white text-lg sm:text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-gray-900">
                      Contact Information
                    </h3>
                    <p className="text-gray-500 text-[10px] sm:text-sm">
                      We're here to assist you
                    </p>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                      <FiPhone className="text-green-600 text-base sm:text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">
                        Phone / WhatsApp
                      </h4>
                      <a
                        href="tel:+923104082056"
                        className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium"
                      >
                        +92 310 4082056
                      </a>
                      <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                        Call or WhatsApp for quick support
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-red-100 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                      <FiMail className="text-red-600 text-base sm:text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">
                        Email Us
                      </h4>
                      <a
                        href="mailto:info@laphub.pk"
                        className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium"
                      >
                        info@laphub.pk
                      </a>
                      <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                        We respond within 2-4 hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                      <MdLocationOn className="text-purple-600 text-base sm:text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">
                        Location
                      </h4>
                      <p className="text-gray-600 text-sm sm:text-base">
                        Lahore, Pakistan
                      </p>
                      <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                        Nationwide shipping available
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="flex items-center mb-2 sm:mb-4">
                    <FiClock
                      className="text-gray-500 mr-1 sm:mr-2"
                      size={12}
                      className="sm:w-3.5 sm:h-3.5"
                    />
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                      Business Hours
                    </h4>
                  </div>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Monday - Saturday</span>
                      <span className="font-medium text-gray-800">
                        10AM - 8PM
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Sunday</span>
                      <span className="font-medium text-gray-800">
                        12PM - 6PM
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Response Badge */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="bg-green-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-center">
                    <div className="flex items-center justify-center mb-0.5 sm:mb-1">
                      <FiCheckCircle
                        className="text-green-600 mr-1"
                        size={12}
                        className="sm:w-3.5 sm:h-3.5"
                      />
                      <span className="text-green-700 text-[10px] sm:text-sm font-medium">
                        Quick Response
                      </span>
                    </div>
                    <p className="text-gray-600 text-[10px] sm:text-xs">
                      We respond within 2-4 hours during business hours
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Card */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center text-white">
                <MdWhatsapp className="text-3xl sm:text-4xl mx-auto mb-2 sm:mb-4" />
                <h3 className="text-base sm:text-xl font-bold mb-1 sm:mb-2">
                  Chat on WhatsApp
                </h3>
                <p className="text-green-100 text-xs sm:text-sm mb-3 sm:mb-4">
                  Get instant support on WhatsApp
                </p>
                <a
                  href="https://wa.me/923104082056"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-white text-green-600 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg font-semibold hover:bg-gray-100 transition text-sm sm:text-base"
                >
                  <MdWhatsapp
                    className="mr-1 sm:mr-2"
                    size={14}
                    className="sm:w-4 sm:h-4"
                  />
                  Start Chat
                </a>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="md:w-2/3">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 border border-gray-100">
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Fill out the form below and we'll get back to you as soon as
                    possible
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >
                  {/* Name Field */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                      <FiUser
                        className="inline mr-1 sm:mr-2 text-gray-500"
                        size={12}
                        className="sm:w-3.5 sm:h-3.5"
                      />
                      Your Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-gray-50 border ${
                        errors.name ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                      <FiMail
                        className="inline mr-1 sm:mr-2 text-gray-500"
                        size={12}
                        className="sm:w-3.5 sm:h-3.5"
                      />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-gray-50 border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                      <FiMessageSquare
                        className="inline mr-1 sm:mr-2 text-gray-500"
                        size={12}
                        className="sm:w-3.5 sm:h-3.5"
                      />
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-gray-50 border ${
                        errors.subject ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.subject}
                      </p>
                    )}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label className="block text-gray-700 font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                      <FiMessageSquare
                        className="inline mr-1 sm:mr-2 text-gray-500"
                        size={12}
                        className="sm:w-3.5 sm:h-3.5"
                      />
                      Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your query in detail..."
                      rows={4}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl bg-gray-50 border ${
                        errors.message ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm`}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-500">
                        {errors.message}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-sm sm:text-base"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend
                          className="mr-1 sm:mr-2"
                          size={14}
                          className="sm:w-4 sm:h-4"
                        />
                        Send Message
                      </>
                    )}
                  </button>
                </form>

                {/* Success Message */}
                {successMessage && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                        <FiCheckCircle
                          className="text-green-600"
                          size={16}
                          className="sm:w-4 sm:h-4"
                        />
                      </div>
                      <p className="text-green-700 font-medium text-xs sm:text-sm">
                        {successMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                    <div className="flex items-center">
                      <div className="bg-red-100 p-1.5 sm:p-2 rounded-lg mr-2 sm:mr-3">
                        <FiAlertCircle
                          className="text-red-600"
                          size={16}
                          className="sm:w-4 sm:h-4"
                        />
                      </div>
                      <p className="text-red-700 font-medium text-xs sm:text-sm">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Privacy Note */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <p className="text-gray-500 text-[10px] sm:text-xs text-center">
                    By submitting this form, you agree to our privacy policy. We
                    respect your privacy and will never share your information
                    with third parties.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
