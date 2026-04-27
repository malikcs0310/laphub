import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiLinkedin,
  FiSend,
} from "react-icons/fi";
import { MdComputer, MdLaptop } from "react-icons/md";
import toast from "react-hot-toast";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const usefulLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const policyLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Return Policy", path: "/returns" },
    { name: "FAQ", path: "/faq" },
  ];

  const socialLinks = [
    {
      icon: FiFacebook,
      url: "https://facebook.com/laphub",
      color: "hover:bg-[#1877f2]",
    },
    {
      icon: FiInstagram,
      url: "https://instagram.com/laphub",
      color: "hover:bg-[#e4405f]",
    },
    {
      icon: FiTwitter,
      url: "https://twitter.com/laphub",
      color: "hover:bg-[#1da1f2]",
    },
    {
      icon: FiYoutube,
      url: "https://youtube.com/laphub",
      color: "hover:bg-[#ff0000]",
    },
    {
      icon: FiLinkedin,
      url: "https://linkedin.com/company/laphub",
      color: "hover:bg-[#0077b5]",
    },
  ];

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      toast.success("Subscribed successfully! Check your email for updates.");
      setEmail("");
      setSubscribing(false);
    }, 1000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column - Strong Brand Identity */}
          <div>
            <div
              className="flex items-center gap-2 mb-4 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                <MdLaptop className="text-white text-xl" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">
                  LapHub<span className="text-blue-400">.pk</span>
                </span>
                <p className="text-[9px] text-gray-400 -mt-0.5">
                  Trusted Laptops Store
                </p>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Pakistan's trusted source for genuine imported laptops. Quality
              products, honest prices, and exceptional support.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <FiPhone className="text-blue-400" size={14} />
                </div>
                <a
                  href="tel:+923104082056"
                  className="hover:text-white transition"
                >
                  +92 310 408 2056
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <FiMail className="text-blue-400" size={14} />
                </div>
                <a
                  href="mailto:info@laphub.pk"
                  className="hover:text-white transition"
                >
                  malikcs0310@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="bg-gray-800 p-2 rounded-lg">
                  <FiMapPin className="text-blue-400" size={14} />
                </div>
                <span>Lahore, Pakistan</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gray-800 p-2.5 rounded-lg hover:scale-110 transition-all duration-200 ${social.color} hover:text-white`}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 group"
                  >
                    <span className="text-blue-400 group-hover:translate-x-1 transition">
                      ›
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies & Business Hours */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Policies</h3>
            <ul className="space-y-2 mb-6">
              {policyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition text-sm flex items-center gap-2 group"
                  >
                    <span className="text-blue-400 group-hover:translate-x-1 transition">
                      ›
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Business Hours */}
            <div className="border-t border-gray-800 pt-4">
              <h4 className="text-white font-semibold text-sm mb-3">
                🕐 Business Hours
              </h4>
              <div className="space-y-1 text-sm text-gray-400">
                <p>Monday - Saturday: 10AM - 8PM</p>
                <p>Sunday: 12PM - 6PM</p>
                <p className="text-blue-400 mt-2">24/7 Online Support</p>
              </div>
            </div>
          </div>

          {/* Newsletter & Stats */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Get exclusive deals and new arrivals directly in your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {subscribing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FiSend size={14} />
                  )}
                  Subscribe
                </button>
              </div>
            </form>

            {/* Trust Stats */}
            <div className="bg-gray-800/50 rounded-xl p-4">
              <h4 className="text-white font-semibold text-sm mb-3 text-center">
                Our Trust Score
              </h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xl font-bold text-blue-400">40+</p>
                  <p className="text-[9px] text-gray-400">Happy Customers</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-400">35+</p>
                  <p className="text-[9px] text-gray-400">Laptops Sold</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-blue-400">100%</p>
                  <p className="text-[9px] text-gray-400">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Brand Strong */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-center">
            <p className="text-gray-500 text-sm">
              © {currentYear}{" "}
              <span className="text-white font-medium">LapHub.pk</span>. All
              rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <span className="flex items-center gap-1 text-gray-500">
                🔒 Secure Checkout
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                🚚 Free Shipping Over Rs 50k
              </span>
              <span className="flex items-center gap-1 text-gray-500">
                ✅ 100% Genuine
              </span>
            </div>
            <p className="text-gray-600 text-xs">
              Made with <span className="text-red-500">❤️</span> in Pakistan
            </p>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40"
          aria-label="Back to top"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </footer>
  );
};

export default Footer;
