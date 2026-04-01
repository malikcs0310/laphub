import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  FiChevronLeft,
  FiChevronRight,
  FiShield,
  FiTruck,
  FiArrowRight,
  FiAward,
  FiRefreshCw,
} from "react-icons/fi";
import { MdLocalOffer, MdVerifiedUser, MdHeadsetMic } from "react-icons/md";
import FeaturedProducts from "../components/admin/FeaturedProducts";
import Testimonials from "../components/Testimonials";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const heroSlides = [
    {
      title: "Dell & HP Business Laptops",
      subtitle: "Premium Imported from USA & UK",
      description:
        "Shop genuine Dell Latitude and HP EliteBook laptops with warranty, premium build quality, and smooth performance for office, study, and business use.",
      image:
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1600&auto=format&fit=crop&q=80",
      buttonText: "View Business Laptops",
      bgColor: "from-slate-950/90 via-blue-950/80 to-slate-900/90",
      brands: ["Dell", "HP", "Latitude", "EliteBook"],
      origin: "USA & UK Import",
      priceRange: "₨60,000 - ₨120,000",
    },
    {
      title: "Lenovo ThinkPad Series",
      subtitle: "Japan & Singapore Import",
      description:
        "Durable ThinkPad laptops with business-grade keyboards, powerful specs, and tested condition. Best choice for professionals and heavy daily use.",
      image:
        "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=1600&auto=format&fit=crop&q=80",
      buttonText: "Browse ThinkPads",
      bgColor: "from-black/90 via-red-950/70 to-slate-950/90",
      brands: ["Lenovo", "ThinkPad", "Core i5", "Core i7"],
      origin: "Japan & Singapore Import",
      priceRange: "₨55,000 - ₨95,000",
    },
    {
      title: "Apple MacBook Imports",
      subtitle: "Genuine MacBooks from USA",
      description:
        "Explore certified refurbished MacBook Air and MacBook Pro models with elegant design, reliable performance, and premium user experience.",
      image:
        "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=1600&auto=format&fit=crop&q=80",
      buttonText: "Shop MacBooks",
      bgColor: "from-slate-900/90 via-gray-900/80 to-black/90",
      brands: ["Apple", "MacBook Air", "MacBook Pro", "Retina"],
      origin: "USA Import",
      priceRange: "₨90,000 - ₨180,000",
    },
    {
      title: "Budget Laptops for Students",
      subtitle: "Starting from ₨45,000",
      description:
        "Affordable laptops from ASUS, Acer, and HP for students, online classes, office tasks, freelancing, and daily home use.",
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1600&auto=format&fit=crop&q=80",
      buttonText: "View Budget Options",
      bgColor: "from-emerald-950/85 via-teal-900/75 to-slate-950/90",
      brands: ["ASUS", "Acer", "HP", "Student Picks"],
      origin: "Multiple Countries",
      priceRange: "₨45,000 - ₨75,000",
    },
    {
      title: "Premium Workstations",
      subtitle: "Dell Precision & HP ZBook",
      description:
        "High-performance workstations for engineers, designers, editors, and creators who need powerful graphics and strong multitasking.",
      image:
        "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=1600&auto=format&fit=crop&q=80",
      buttonText: "Explore Workstations",
      bgColor: "from-purple-950/90 via-indigo-950/75 to-slate-950/90",
      brands: ["Dell Precision", "HP ZBook", "Workstation", "Pro Series"],
      origin: "Germany Import",
      priceRange: "₨95,000 - ₨150,000",
    },
  ];

  const features = [
    {
      icon: <MdVerifiedUser className="text-blue-600" size={28} />,
      title: "Genuine Products",
      description: "100% authentic imported laptops with quality assurance.",
    },
    {
      icon: <FiTruck className="text-green-600" size={28} />,
      title: "Fast Delivery",
      description: "Safe and reliable shipping available across Pakistan.",
    },
    {
      icon: <FiShield className="text-purple-600" size={28} />,
      title: "Secure Payments",
      description: "Protected checkout process with trusted payment methods.",
    },
    {
      icon: <MdHeadsetMic className="text-orange-500" size={28} />,
      title: "Support Available",
      description:
        "Friendly customer support for guidance and after-sales help.",
    },
  ];

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroSlides.length, isPaused]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);

  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length,
    );

  const current = heroSlides[currentSlide];

  // Generate schema markup for SEO
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LapHub.pk",
    url: "https://laphub.pk",
    description:
      "Best imported laptops in Pakistan - Dell, HP, Lenovo, Apple MacBook with warranty and free shipping",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://laphub.pk/products?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationMarkup = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LapHub.pk",
    url: "https://laphub.pk",
    logo: "https://laphub.pk/logo.png",
    sameAs: [
      "https://www.facebook.com/laphub",
      "https://www.instagram.com/laphub",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+92-310-4082056",
      contactType: "customer service",
      availableLanguage: ["English", "Urdu"],
    },
  };

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>
          LapHub.pk - Best Imported Laptops in Pakistan | Dell, HP, Lenovo,
          Apple
        </title>
        <meta
          name="description"
          content="Buy premium imported laptops in Pakistan from LapHub.pk. Shop Dell, HP, Lenovo ThinkPad, Apple MacBook with warranty, free shipping & best prices. Trusted by 40+ customers."
        />
        <meta
          name="keywords"
          content="laptops in pakistan, dell laptops, hp laptops, lenovo thinkpad, macbook price in pakistan, imported laptops, refurbished laptops, best laptop store"
        />
        <meta name="author" content="LapHub.pk" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Canonical URL */}
        <link rel="canonical" href="https://laphub.pk" />

        {/* Open Graph / Facebook Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://laphub.pk" />
        <meta
          property="og:title"
          content="LapHub.pk - Best Imported Laptops in Pakistan"
        />
        <meta
          property="og:description"
          content="Shop premium imported laptops from Dell, HP, Lenovo, and Apple. Free shipping, 1-year warranty, and best price guarantee."
        />
        <meta
          property="og:image"
          content="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200&auto=format"
        />
        <meta property="og:site_name" content="LapHub.pk" />
        <meta property="og:locale" content="en_PK" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://laphub.pk" />
        <meta
          name="twitter:title"
          content="LapHub.pk - Best Imported Laptops in Pakistan"
        />
        <meta
          name="twitter:description"
          content="Shop premium imported laptops from Dell, HP, Lenovo, and Apple. Free shipping, 1-year warranty, and best price guarantee."
        />
        <meta
          name="twitter:image"
          content="https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=1200&auto=format"
        />

        {/* Additional SEO Tags */}
        <meta name="geo.region" content="PK" />
        <meta name="geo.placename" content="Lahore" />
        <meta name="geo.position" content="31.5204;74.3587" />
        <meta name="ICBM" content="31.5204, 74.3587" />

        {/* Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(organizationMarkup)}
        </script>

        {/* Preconnect for faster loading */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </Helmet>

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative min-h-[92vh] w-full">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src={current.image}
                alt={current.title}
                className="h-full w-full object-cover"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${current.bgColor}`}
              ></div>
              <div className="absolute inset-0 bg-black/35"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 mx-auto flex min-h-[92vh] max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
              <div className="grid w-full grid-cols-1 items-center gap-10 lg:grid-cols-2">
                {/* Left Side */}
                <div className="text-white">
                  <span className="mb-5 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur-md">
                    <MdLocalOffer className="mr-2" />
                    Limited Time Deals on Imported Laptops
                  </span>

                  <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
                    {current.title}
                  </h1>

                  <h2 className="mt-4 text-xl font-medium text-blue-200 sm:text-2xl lg:text-3xl">
                    {current.subtitle}
                  </h2>

                  <p className="mt-6 max-w-2xl text-base leading-7 text-gray-200 sm:text-lg">
                    {current.description}
                  </p>

                  {/* chips */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    {current.brands.map((brand, index) => (
                      <span
                        key={index}
                        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/95 backdrop-blur-sm"
                      >
                        {brand}
                      </span>
                    ))}
                  </div>

                  {/* info cards */}
                  <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                      <p className="text-sm text-gray-300">Import Source</p>
                      <h3 className="mt-1 text-lg font-semibold">
                        {current.origin}
                      </h3>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md">
                      <p className="text-sm text-gray-300">Price Range</p>
                      <h3 className="mt-1 text-lg font-semibold">
                        {current.priceRange}
                      </h3>
                    </div>
                  </div>

                  {/* buttons */}
                  <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <Link
                      to="/products"
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition hover:scale-[1.02] hover:bg-blue-700"
                    >
                      {current.buttonText}
                      <FiArrowRight className="ml-2" />
                    </Link>

                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>

                {/* Right Side */}
                <div className="hidden lg:flex justify-end">
                  <div className="relative w-full max-w-xl">
                    <div className="absolute -inset-4 rounded-[2rem] bg-white/10 blur-2xl"></div>
                    <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md">
                      <img
                        src={current.image}
                        alt={current.title}
                        className="h-[520px] w-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                        <p className="text-sm text-gray-200">
                          {current.origin}
                        </p>
                        <h3 className="mt-1 text-2xl font-bold">
                          {current.title}
                        </h3>
                        <p className="mt-2 text-sm text-gray-300">
                          {current.priceRange}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* arrows */}
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <FiChevronLeft size={24} />
            </button>

            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-30 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <FiChevronRight size={24} />
            </button>

            {/* dots */}
            <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "w-8 bg-blue-500"
                      : "w-3 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-14 max-w-3xl text-center">
              <span className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                Why Choose Us
              </span>
              <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Trusted Store for Imported Laptops
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-600 sm:text-lg">
                We provide carefully selected laptops with professional support,
                quality checking, and a smooth buying experience for students,
                freelancers, and professionals.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="mb-6 inline-flex rounded-2xl bg-gray-50 p-4 transition group-hover:scale-105">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="mt-3 text-gray-600 leading-7">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="bg-gray-50 py-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <div className="mb-4 inline-flex rounded-2xl bg-blue-50 p-4">
                <FiAward className="text-blue-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Quality Checked
              </h3>
              <p className="mt-3 text-gray-600 leading-7">
                Every laptop is properly checked for performance, battery,
                display, keyboard, and overall condition before listing.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <div className="mb-4 inline-flex rounded-2xl bg-green-50 p-4">
                <FiRefreshCw className="text-green-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Easy Buying Experience
              </h3>
              <p className="mt-3 text-gray-600 leading-7">
                Browse products, compare prices, and choose the best laptop for
                office, study, gaming, or professional work.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <div className="mb-4 inline-flex rounded-2xl bg-purple-50 p-4">
                <FiShield className="text-purple-600" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Safe & Reliable
              </h3>
              <p className="mt-3 text-gray-600 leading-7">
                Our goal is to make laptop shopping more reliable, transparent,
                and comfortable for every customer in Pakistan.
              </p>
            </div>
          </div>
        </section>

        {/* Customer Testimonials - Using Testimonials Component */}
        <Testimonials />

        {/* Featured Products */}
        <FeaturedProducts />
      </div>
    </>
  );
};

export default Home;
