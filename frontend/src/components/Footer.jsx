import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiShield,
  FiTruck,
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiLinkedin,
  FiSend,
  FiCheckCircle,
  FiClock,
  FiRefreshCw,
} from "react-icons/fi";
import { MdComputer, MdSupport, MdVerifiedUser } from "react-icons/md";
import toast from "react-hot-toast";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Check scroll position to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const usefulLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Return Policy", path: "/returns" },
    { name: "FAQ", path: "/faq" },
  ];

  const popularBrands = [
    { name: "Dell", count: 45 },
    { name: "HP", count: 38 },
    { name: "Lenovo", count: 32 },
    { name: "Apple", count: 25 },
    { name: "ASUS", count: 28 },
    { name: "Acer", count: 22 },
    { name: "Microsoft", count: 15 },
    { name: "MSI", count: 12 },
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
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-gray-300">
      {/* Features Bar */}
      <div className="border-b border-gray-800/50 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="flex items-center justify-center lg:justify-start space-x-3 group cursor-pointer"
              onClick={scrollToTop}
            >
              <div className="bg-blue-600/20 p-3 rounded-xl group-hover:bg-blue-600/30 transition">
                <FiTruck className="text-blue-400" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Free Shipping</h4>
                <p className="text-sm text-gray-400">
                  On orders over Rs 50,000
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-3 group">
              <div className="bg-green-600/20 p-3 rounded-xl group-hover:bg-green-600/30 transition">
                <MdVerifiedUser className="text-green-400" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-white">100% Genuine</h4>
                <p className="text-sm text-gray-400">Official Warranty</p>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-3 group">
              <div className="bg-purple-600/20 p-3 rounded-xl group-hover:bg-purple-600/30 transition">
                <FiRefreshCw className="text-purple-400" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-white">Easy Returns</h4>
                <p className="text-sm text-gray-400">7 Days Return Policy</p>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-3 group">
              <div className="bg-orange-600/20 p-3 rounded-xl group-hover:bg-orange-600/30 transition">
                <MdSupport className="text-orange-400" size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-white">24/7 Support</h4>
                <p className="text-sm text-gray-400">We're Here to Help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          {/* Brand & Info */}
          <div>
            <div
              className="flex items-center space-x-3 mb-4 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2.5 rounded-xl shadow-lg">
                <MdComputer className="text-white" size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  LapHub<span className="text-blue-400">.pk</span>
                </h2>
                <p className="text-xs text-gray-500">
                  Your Trusted Laptop Store
                </p>
              </div>
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Pakistan's fastest growing laptop store. We provide genuine
              imported laptops with warranty, free shipping, and 24/7 customer
              support.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm group">
                <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-blue-600/20 transition">
                  <FiPhone className="text-blue-400" size={16} />
                </div>
                <a
                  href="tel:+923104082056"
                  className="hover:text-white transition"
                >
                  +92 310 408 2056
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm group">
                <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-blue-600/20 transition">
                  <FiMail className="text-blue-400" size={16} />
                </div>
                <a
                  href="mailto:info@laphub.pk"
                  className="hover:text-white transition"
                >
                  info@laphub.pk
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm group">
                <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-blue-600/20 transition">
                  <FiMapPin className="text-blue-400" size={16} />
                </div>
                <span>Lahore, Pakistan</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3 mt-6">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`bg-gray-800 p-2 rounded-lg hover:scale-110 transition-all duration-200 ${social.color} hover:text-white`}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition text-sm flex items-center group"
                  >
                    <span className="mr-2 opacity-0 group-hover:opacity-100 transition">
                      →
                    </span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 relative inline-block">
              Popular Brands
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularBrands.map((brand, index) => (
                <Link
                  key={index}
                  to={`/products?brand=${brand.name}`}
                  className="group relative px-3 py-1.5 bg-gray-800 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-700 rounded-lg text-sm transition-all duration-200 cursor-pointer"
                >
                  <span className="text-gray-400 group-hover:text-white transition">
                    {brand.name}
                  </span>
                  <span className="absolute -top-1 -right-1 text-[10px] bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                    {brand.count}
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <FiClock className="text-blue-400" size={16} />
                Business Hours
              </h4>
              <div className="space-y-1 text-sm text-gray-400">
                <div className="flex justify-between">
                  <span>Monday - Saturday:</span>
                  <span className="text-white">10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="text-white">12:00 PM - 6:00 PM</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>24/7 Online Support Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-5 relative inline-block">
              Stay Updated
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>

            <p className="text-gray-400 text-sm mb-5 leading-relaxed">
              Subscribe to get exclusive deals, new arrivals, and special offers
              directly to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="flex-grow px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm transition"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribing}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {subscribing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <FiSend size={16} />
                  )}
                  Subscribe
                </button>
              </div>
            </form>

            {/* Trust Badges */}
            <div className="border-t border-gray-800 pt-5">
              <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                <FiShield className="text-green-400" size={16} />
                We Accept
              </h4>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="px-3 py-1 bg-gray-800 rounded-lg">Cash</span>
                <span className="px-3 py-1 bg-gray-800 rounded-lg">
                  Bank Transfer
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded-lg">
                  EasyPaisa
                </span>
                <span className="px-3 py-1 bg-gray-800 rounded-lg">
                  JazzCash
                </span>
              </div>
            </div>

            {/* Customer Stats */}
            <div className="mt-5 pt-4 border-t border-gray-800">
              <div className="flex justify-between text-sm">
                <div className="text-center">
                  <p className="text-xl font-bold text-white">40+</p>
                  <p className="text-xs text-gray-500">Happy Customers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">35+</p>
                  <p className="text-xs text-gray-500">Laptops Sold</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-white">100%</p>
                  <p className="text-xs text-gray-500">Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800/50 py-5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear}{" "}
              <span className="text-white font-medium">LapHub.pk</span>. All
              rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <FiShield className="text-green-400" size={14} />
                <span>Secure SSL</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <MdVerifiedUser className="text-blue-400" size={14} />
                <span>Verified Store</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <FiCheckCircle className="text-green-400" size={14} />
                <span>100% Genuine</span>
              </div>
            </div>
            <div className="text-gray-500 text-sm text-center">
              Made with <span className="text-red-500">❤️</span> in Pakistan
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button - Only shows when scrolled down */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110 z-40"
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
