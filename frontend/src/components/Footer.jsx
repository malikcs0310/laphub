import { Link } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiShield, FiTruck } from "react-icons/fi";
import { MdComputer, MdSupport } from "react-icons/md";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const usefulLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms", path: "/terms" },
  ];

  const popularBrands = ["Dell", "HP", "Lenovo", "Apple", "Asus", "Acer"];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Simple Features Bar */}
      <div className="border-b border-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Free Shipping */}
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-blue-600/20 p-2 rounded">
                <FiTruck className="text-blue-400" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white">Free Shipping</h4>
                <p className="text-sm text-gray-400">Nationwide Delivery</p>
              </div>
            </div>

            {/* Genuine Products */}
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-green-600/20 p-2 rounded">
                <MdComputer className="text-green-400" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white">Genuine Products</h4>
                <p className="text-sm text-gray-400">With Warranty</p>
              </div>
            </div>

            {/* Support */}
            <div className="flex items-center justify-center space-x-3">
              <div className="bg-purple-600/20 p-2 rounded">
                <MdSupport className="text-purple-400" size={20} />
              </div>
              <div>
                <h4 className="font-medium text-white">Support</h4>
                <p className="text-sm text-gray-400">We're Here to Help</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-2 rounded">
                <MdComputer className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">LapHub.pk</h2>
                <p className="text-sm text-gray-400">Your Laptop Destination</p>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-6">
              Your trusted source for genuine imported laptops at competitive
              prices.
            </p>

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <FiPhone className="text-blue-400" size={16} />
                <a
                  href="tel:+923001234567"
                  className="hover:text-white transition"
                >
                  +92 310 408 2056
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FiMail className="text-blue-400" size={16} />
                <a
                  href="mailto:info@laphub.pk"
                  className="hover:text-white transition"
                >
                  malikcs0310@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <FiMapPin className="text-blue-400" size={16} />
                <span>Lahore, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {usefulLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition text-sm flex items-center"
                  >
                    <span className="mr-2">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Popular Brands
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularBrands.map((brand, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm cursor-pointer transition"
                >
                  {brand}
                </span>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="font-medium text-white mb-2">Business Hours</h4>
              <div className="text-sm text-gray-400 space-y-1">
                <p>Mon - Sat: 10:00 AM - 8:00 PM</p>
                <p>Sunday: 12:00 PM - 6:00 PM</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Stay Updated
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              Get updates on new arrivals and special offers.
            </p>

            <div className="mb-6">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-grow px-4 py-2 bg-gray-800 border border-gray-700 rounded-l focus:outline-none focus:border-blue-500 text-sm"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r text-sm font-medium transition">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-4">
              <h4 className="font-medium text-white mb-2">We Accept</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <span>Cash</span>
                <span>•</span>
                <span>Bank Transfer</span>
                <span>•</span>
                <span>EasyPaisa</span>
                <span>•</span>
                <span>JazzCash</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-500 text-sm mb-3 md:mb-0 text-center md:text-left">
              © {currentYear} LapHub.pk. All rights reserved.
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <FiShield className="text-green-400" />
                <span>Secure</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <MdComputer className="text-blue-400" />
                <span>Genuine</span>
              </div>
            </div>

            {/* Made with love */}
            <div className="text-gray-500 text-sm mt-3 md:mt-0 text-center">
              Made with ❤️ in Pakistan
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
