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
    /* same data unchanged */
  ];

  const features = [
    /* same data unchanged */
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

  return (
    <>
      <Helmet>
        <title>LapHub.pk - Best Imported Laptops in Pakistan</title>
      </Helmet>

      <div className="min-h-screen bg-white text-gray-900">
        {/* HERO */}
        <section
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative h-[88vh] w-full">
            {/* Background */}
            <div className="absolute inset-0">
              <img
                src={current.image}
                className="h-full w-full object-cover scale-105"
                alt={current.title}
              />
              <div
                className={`absolute inset-0 bg-gradient-to-r ${current.bgColor}`}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative z-20 max-w-7xl mx-auto h-full flex items-center px-6">
              <div className="grid lg:grid-cols-2 gap-10 w-full items-center">
                {/* LEFT */}
                <div className="text-white space-y-4">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur">
                    <MdLocalOffer size={14} />
                    Limited Time Deals
                  </span>

                  <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                    {current.title}
                  </h1>

                  <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-xl">
                    {current.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {current.brands.slice(0, 3).map((b, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 rounded-full bg-white/10 border border-white/20"
                      >
                        {b}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Link
                      to="/products"
                      className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2"
                    >
                      Explore <FiArrowRight />
                    </Link>
                    <Link
                      to="/contact"
                      className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl border border-white/20"
                    >
                      Contact
                    </Link>
                  </div>
                </div>

                {/* RIGHT (desktop image card) */}
                <div className="hidden lg:flex justify-end">
                  <div className="relative w-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <img
                      src={current.image}
                      className="h-[420px] w-full object-cover"
                      alt=""
                    />
                    <div className="absolute bottom-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent text-white">
                      <p className="text-sm text-gray-300">{current.origin}</p>
                      <h3 className="text-xl font-semibold">{current.title}</h3>
                      <p className="text-sm text-gray-300">
                        {current.priceRange}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full"
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full"
            >
              <FiChevronRight />
            </button>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col gap-3"
              >
                <div>{f.icon}</div>
                <h3 className="font-semibold text-lg">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-10">
          <FeaturedProducts />
        </section>

        {/* WHY CHOOSE */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center mb-10">
            <h2 className="text-3xl font-bold">Why Choose Us</h2>
            <p className="text-gray-600 mt-2">
              Trusted laptop store with quality assurance
            </p>
          </div>

          <div className="max-w-7xl mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border bg-gray-50 hover:bg-white hover:shadow-md transition"
              >
                {f.icon}
                <h3 className="mt-3 font-semibold">{f.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{f.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST */}
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">
            {[FiAward, FiRefreshCw, FiShield].map((Icon, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm">
                <Icon className="text-blue-600" size={24} />
                <h3 className="font-semibold text-xl mt-3">
                  {i === 0
                    ? "Quality Checked"
                    : i === 1
                      ? "Easy Buying"
                      : "Safe & Reliable"}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Professional laptop selection and verified quality.
                </p>
              </div>
            ))}
          </div>
        </section>

        <Testimonials />
      </div>
    </>
  );
};

export default Home;
