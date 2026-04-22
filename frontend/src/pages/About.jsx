import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import {
  FiTarget,
  FiAward,
  FiCheckCircle,
  FiShield,
  FiStar,
  FiTrendingUp,
  FiArrowRight,
  FiThumbsUp,
  FiClock,
  FiUsers,
  FiHeart,
  FiBriefcase,
  FiSmile,
  FiMessageCircle,
} from "react-icons/fi";
import {
  MdComputer,
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdSupportAgent,
  MdVerifiedUser,
  MdLocalShipping,
  MdStorefront,
  MdStar,
  MdStarHalf,
} from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import Testimonials from "../components/Testimonials";

const About = () => {
  const stats = [
    {
      value: "40+",
      label: "Happy Customers",
      icon: FiUsers,
      description: "And counting...",
    },
    {
      value: "35+",
      label: "Laptops Sold",
      icon: MdComputer,
      description: "Genuine products",
    },
    {
      value: "100%",
      label: "Satisfaction Rate",
      icon: FiStar,
      description: "No complaints yet!",
    },
    {
      value: "24/7",
      label: "Customer Support",
      icon: MdSupportAgent,
      description: "Always here",
    },
  ];

  const values = [
    {
      icon: FiHeart,
      title: "Customer First",
      description:
        "Your satisfaction is our top priority. We put customers before profits.",
      color: "red",
    },
    {
      icon: FiShield,
      title: "Integrity",
      description:
        "Honest advice, transparent pricing, and genuine products only.",
      color: "blue",
    },
    {
      icon: FiTrendingUp,
      title: "Excellence",
      description:
        "Striving for the best in everything we do, from products to service.",
      color: "green",
    },
    {
      icon: FiUsers,
      title: "Community",
      description:
        "Building a community of tech enthusiasts and happy laptop owners.",
      color: "purple",
    },
  ];

  return (
    <>
      <Helmet>
        <title>About Us - LapHub.pk | Pakistan's Trusted Laptop Store</title>
        <meta
          name="description"
          content="LapHub.pk - Pakistan's fastest growing laptop store. We've helped 40+ happy customers find their perfect laptop. 100% genuine products with warranty."
        />
        <meta
          name="keywords"
          content="about laphub, laptop store pakistan, genuine laptops, tech store lahore, laptop reviews"
        />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section - Mobile Optimized */}
        <section className="relative overflow-hidden bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1600&auto=format')] bg-cover bg-center opacity-10"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
          <div className="container mx-auto px-4 py-16 sm:py-24 md:py-32 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-white/10 backdrop-blur-sm rounded-full mb-4 sm:mb-6">
                <span className="text-white text-[11px] sm:text-sm">
                  Welcome to
                </span>
                <span className="ml-1 sm:ml-2 text-blue-300 font-semibold text-[11px] sm:text-sm">
                  LapHub.pk
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 sm:mb-6">
                Trusted by <span className="text-blue-400">40+ Customers</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg xl:text-xl text-gray-200 mb-6 sm:mb-8 leading-relaxed max-w-3xl mx-auto px-2">
                In just 4 months, we've helped 40+ customers find their perfect
                laptop. Genuine products, honest advice, and exceptional support
                - that's our promise.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                {stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                      {stat.value}
                    </div>
                    <div className="text-gray-300 text-[10px] sm:text-xs md:text-sm mt-0.5 sm:mt-1">
                      {stat.label}
                    </div>
                    <div className="text-blue-300 text-[8px] sm:text-[10px] md:text-xs mt-0.5">
                      {stat.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Real Customer Feedback Section - Already using Testimonials component which is mobile optimized */}
        <Testimonials />

        {/* Who We Are - Mobile Optimized */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-8 sm:gap-10 md:gap-12">
              <div className="lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl sm:rounded-3xl blur-xl"></div>
                  <img
                    src="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1600&auto=format&fit=crop"
                    alt="Laptop Selection"
                    className="relative rounded-xl sm:rounded-2xl shadow-2xl w-full"
                  />
                  <div className="absolute -bottom-3 -right-3 sm:-bottom-6 sm:-right-6 bg-blue-600 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-lg shadow-lg">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <FiStar className="text-yellow-400 text-xs sm:text-sm" />
                      <span className="font-semibold text-xs sm:text-sm">
                        4.9/5 Rating
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-1/2">
                <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-blue-50 rounded-full mb-3 sm:mb-4">
                  <span className="text-blue-600 text-[10px] sm:text-sm font-semibold">
                    Our Journey
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                  From Zero to 40+ Happy Customers
                </h2>
                <div className="space-y-3 sm:space-y-4 text-gray-600 text-sm sm:text-base">
                  <p>
                    <span className="font-semibold text-blue-600">
                      LapHub.pk
                    </span>{" "}
                    started just
                    <span className="font-semibold"> 4 months ago</span> with a
                    simple mission: provide genuine laptops at honest prices.
                  </p>
                  <p>
                    Today, we're proud to have served{" "}
                    <span className="font-semibold">40+ customers</span>
                    across Pakistan. Every laptop is personally checked for
                    quality before delivery, and every customer gets our full
                    support even after the sale.
                  </p>
                  <p>
                    What makes us different?{" "}
                    <span className="font-semibold">
                      No pushy sales, no hidden charges, no refurbished
                      products.
                    </span>{" "}
                    Just honest advice and genuine laptops that work.
                  </p>
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg mt-3 sm:mt-4">
                    <p className="text-xs sm:text-sm text-gray-700">
                      <span className="font-semibold">Fun Fact:</span> We've
                      received{" "}
                      <span className="font-semibold">0 complaints</span>
                      from our 40+ customers. That's a 100% satisfaction rate!
                    </p>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-start">
                    <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-3 sm:mr-4">
                      <HiOutlineLightBulb className="text-blue-600 text-base sm:text-xl" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">
                        Our Vision
                      </h4>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        To become Pakistan's most trusted laptop provider by
                        delivering genuine products, competitive prices, and
                        exceptional customer service.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values - Mobile Optimized */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-blue-50 rounded-full mb-3 sm:mb-4">
                <span className="text-blue-600 text-[10px] sm:text-sm font-semibold">
                  Our Core Values
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                What Drives Us
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                These principles guide everything we do at LapHub.pk
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {values.map((value, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
                >
                  <div
                    className={`p-2 sm:p-3 rounded-xl bg-${value.color}-50 w-fit mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <value.icon
                      className={`text-${value.color}-600 text-xl sm:text-2xl`}
                    />
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us - Mobile Optimized */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-blue-50 rounded-full mb-3 sm:mb-4">
                <span className="text-blue-600 text-[10px] sm:text-sm font-semibold">
                  Why Choose Us
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                The LapHub.pk Difference
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                What sets us apart from other laptop stores
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[
                {
                  icon: MdVerifiedUser,
                  title: "100% Genuine Products",
                  description:
                    "Only authentic laptops with official manufacturer warranty.",
                  color: "blue",
                },
                {
                  icon: FiStar,
                  title: "40+ Happy Customers",
                  description:
                    "Every customer leaves satisfied. 0 complaints so far!",
                  color: "green",
                },
                {
                  icon: FiTrendingUp,
                  title: "Competitive Pricing",
                  description: "Best value for your money guaranteed.",
                  color: "purple",
                },
                {
                  icon: FiShield,
                  title: "After-Sales Support",
                  description:
                    "We're here even after the sale. Setup help and support.",
                  color: "orange",
                },
                {
                  icon: FiCheckCircle,
                  title: "Honest Advice",
                  description:
                    "No pushy sales tactics. We tell you what you need.",
                  color: "red",
                },
                {
                  icon: MdLocalShipping,
                  title: "Fast Delivery",
                  description:
                    "Quick shipping across Pakistan. 3-5 business days.",
                  color: "cyan",
                },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="group bg-white p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1"
                >
                  <div
                    className={`p-2 sm:p-3 rounded-xl bg-${feature.color}-50 w-fit mb-3 sm:mb-4`}
                  >
                    <feature.icon
                      className={`text-${feature.color}-600 text-xl sm:text-2xl`}
                    />
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Promise - Mobile Optimized */}
        <section className="py-12 sm:py-16 md:py-20 bg-[#111827]">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-white/10 backdrop-blur-sm rounded-full mb-6 sm:mb-8">
                <FiAward
                  className="text-yellow-400 mr-2 sm:mr-3"
                  size={18}
                  className="sm:w-6 sm:h-6"
                />
                <span className="text-white text-sm sm:text-lg font-semibold">
                  Our Commitment to You
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8">
                The LapHub.pk Promise
              </h2>

              <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 text-left">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg mr-3 sm:mr-4">
                        <FiThumbsUp
                          className="text-green-600"
                          size={16}
                          className="sm:w-5 sm:h-5"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">
                          100% Satisfaction
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Every laptop tested before delivery
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg mr-3 sm:mr-4">
                        <FiShield
                          className="text-blue-600"
                          size={16}
                          className="sm:w-5 sm:h-5"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">
                          Warranty Protection
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Full manufacturer warranty on all products
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg mr-3 sm:mr-4">
                        <FiClock
                          className="text-purple-600"
                          size={16}
                          className="sm:w-5 sm:h-5"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">
                          24/7 Support
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Quick response to all queries
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 sm:space-y-6">
                    <div className="flex items-start">
                      <div className="p-1.5 sm:p-2 bg-red-100 rounded-lg mr-3 sm:mr-4">
                        <MdVerifiedUser
                          className="text-red-600"
                          size={16}
                          className="sm:w-5 sm:h-5"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">
                          Price Match
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Found a better price? We'll match it
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg mr-3 sm:mr-4">
                        <FiTarget
                          className="text-orange-600"
                          size={16}
                          className="sm:w-5 sm:h-5"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">
                          Right Recommendation
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Honest advice tailored to your needs
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="p-1.5 sm:p-2 bg-cyan-100 rounded-lg mr-3 sm:mr-4">
                        <MdSupportAgent
                          className="text-cyan-600"
                          size={16}
                          className="sm:w-5 sm:h-5"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-0.5 sm:mb-1">
                          Setup Assistance
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm">
                          Free basic setup guidance with every purchase
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-gray-200">
                  <p className="text-gray-600 italic text-center text-sm sm:text-base">
                    "We're building this business one satisfied customer at a
                    time. Your trust is our most valuable asset."
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm text-center mt-2 sm:mt-3">
                    — Muhammad Usama, Founder LapHub.pk
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Mobile Optimized */}
        <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Ready to Join Our 40+ Happy Customers?
              </h2>
              <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                Find your perfect laptop today. We're here to help!
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
                  <div className="p-5 sm:p-6 md:p-8 text-center">
                    <div className="p-2 sm:p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                      <MdPhone className="text-blue-600 text-xl sm:text-2xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                      Call or WhatsApp
                    </h3>
                    <a
                      href="tel:+923104082056"
                      className="text-blue-600 hover:text-blue-700 text-sm sm:text-lg font-medium"
                    >
                      +92 310 4082056
                    </a>
                    <p className="text-gray-500 text-[10px] sm:text-sm mt-1 sm:mt-2">
                      Mon-Sat, 10am-8pm
                    </p>
                  </div>

                  <div className="p-5 sm:p-6 md:p-8 text-center">
                    <div className="p-2 sm:p-3 bg-green-100 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                      <MdEmail className="text-green-600 text-xl sm:text-2xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                      Email Us
                    </h3>
                    <a
                      href="mailto:info@laphub.pk"
                      className="text-blue-600 hover:text-blue-700 text-sm sm:text-lg font-medium"
                    >
                      malikcs0310@gmail.com
                    </a>
                    <p className="text-gray-500 text-[10px] sm:text-sm mt-1 sm:mt-2">
                      24/7 Response
                    </p>
                  </div>

                  <div className="p-5 sm:p-6 md:p-8 text-center">
                    <div className="p-2 sm:p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                      <MdLocationOn className="text-purple-600 text-xl sm:text-2xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                      Based In
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      Lahore, Pakistan
                    </p>
                    <p className="text-gray-500 text-[10px] sm:text-sm mt-1 sm:mt-2">
                      Nationwide Shipping
                    </p>
                  </div>

                  <div className="p-5 sm:p-6 md:p-8 text-center">
                    <div className="p-2 sm:p-3 bg-orange-100 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                      <MdStorefront className="text-orange-600 text-xl sm:text-2xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">
                      Browse Online
                    </h3>
                    <Link
                      to="/products"
                      className="text-blue-600 hover:text-blue-700 text-sm sm:text-base font-medium"
                    >
                      Shop Now →
                    </Link>
                    <p className="text-gray-500 text-[10px] sm:text-sm mt-1 sm:mt-2">
                      40+ laptops sold
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 sm:p-6 border-t border-gray-200">
                  <p className="text-gray-600 text-center text-sm sm:text-base mb-4 sm:mb-6">
                    Prefer to browse first? Check out our available laptops
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold transition duration-200 text-sm sm:text-base"
                    >
                      <MdComputer
                        className="mr-2"
                        size={16}
                        className="sm:w-5 sm:h-5"
                      />
                      Browse Laptops
                    </Link>
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 sm:px-8 sm:py-3 rounded-lg font-semibold transition duration-200 text-sm sm:text-base"
                    >
                      <FiArrowRight
                        className="mr-2"
                        size={16}
                        className="sm:w-5 sm:h-5"
                      />
                      Contact Form
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default About;
