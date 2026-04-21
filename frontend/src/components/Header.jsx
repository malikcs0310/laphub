import { useEffect, useState, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiMenu,
  FiX,
  FiShoppingCart,
  FiTrash2,
  FiUser,
  FiLogOut,
  FiHeart,
  FiGrid,
  FiPackage,
  FiPhone,
  FiMapPin,
  FiChevronRight,
} from "react-icons/fi";
import { MdLaptop, MdOutlineSecurity } from "react-icons/md";
import { HiOutlineDesktopComputer } from "react-icons/hi";
import { getCartItems, removeFromCart } from "../utils/cartUtils";
import toast from "react-hot-toast";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const loadCartItems = useCallback(() => {
    setCartItems(getCartItems());
  }, []);

  const handleRemove = useCallback((id) => {
    const updatedCart = removeFromCart(id);
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success("Item removed from cart");
  }, []);

  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (total, item) => total + (Number(item.price) || 0),
      0,
    );
  }, [cartItems]);

  const cartCount = useMemo(() => cartItems.length, [cartItems]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    loadCartItems();
    const handleCartUpdate = () => loadCartItems();
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, [loadCartItems]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileOpen && !event.target.closest(".profile-dropdown")) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  useEffect(() => {
    if (isCartOpen || isMenuOpen || mobileSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isMenuOpen, mobileSearchOpen]);

  const handleSearch = useCallback(() => {
    const value = searchTerm.trim();
    if (!value) {
      navigate("/products");
      setIsMenuOpen(false);
      setMobileSearchOpen(false);
      return;
    }

    navigate(`/products?search=${encodeURIComponent(value)}`);
    setIsMenuOpen(false);
    setMobileSearchOpen(false);
  }, [searchTerm, navigate]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") handleSearch();
    },
    [handleSearch],
  );

  const openCartDrawer = useCallback(() => {
    loadCartItems();
    setIsCartOpen(true);
    setIsMenuOpen(false);
    setMobileSearchOpen(false);
  }, [loadCartItems]);

  const handleViewCart = useCallback(() => {
    setIsCartOpen(false);
    navigate("/cart");
  }, [navigate]);

  const handleCheckout = useCallback(() => {
    setIsCartOpen(false);
    navigate("/checkout");
  }, [navigate]);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    setIsProfileOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  }, [navigate]);

  const getImageUrl = useCallback(
    (imagePath) => {
      if (!imagePath) return "https://via.placeholder.com/100x80?text=No+Image";
      return `${API_URL}/uploads/${imagePath}`;
    },
    [API_URL],
  );

  const isActive = (path) => location.pathname === path;

  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur-md transition-all duration-300 ${
          isScrolled ? "shadow-lg shadow-gray-200/70" : "shadow-sm"
        }`}
      >
        {/* Top Bar - Hidden on mobile */}
        <div className="hidden md:block border-b bg-gray-950 text-gray-300">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:text-sm">
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="tel:+923104082056"
                className="flex items-center gap-1 sm:gap-2 transition hover:text-white"
              >
                <FiPhone size={12} />
                <span>+92 310 4082056</span>
              </a>
              <div className="flex items-center gap-1 sm:gap-2">
                <FiMapPin size={12} />
                <span>Lahore, Pakistan</span>
              </div>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="flex items-center gap-1 sm:gap-2 text-green-400">
                <HiOutlineDesktopComputer size={13} />
                <span className="hidden xs:inline">Premium Laptops</span>
              </span>
              <span className="flex items-center gap-1 sm:gap-2">
                <MdOutlineSecurity size={13} />
                <span className="hidden xs:inline">Secure Payments</span>
              </span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-4 py-3 sm:py-4">
          {/* Left Side - Menu Button + Logo */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-xl p-1.5 sm:p-2 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 lg:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>

            <Link
              to="/"
              className="group flex items-center gap-2 sm:gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-1.5 sm:p-2 md:p-3 shadow-md transition duration-300 group-hover:scale-105">
                <MdLaptop className="text-white text-xl sm:text-2xl md:text-[28px]" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-gray-900">
                  LapHub<span className="text-blue-600">.pk</span>
                </h1>
                <p className="hidden xs:block text-[10px] sm:text-xs text-gray-500">
                  Trusted Laptops Store
                </p>
              </div>
            </Link>
          </div>

          {/* Center - Search (Desktop only) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search laptops, brands, specs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-28 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
            >
              Search
            </button>
          </div>

          {/* Right Side - Icons */}
          <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden rounded-xl p-1.5 sm:p-2 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
            >
              <FiSearch size={18} />
            </button>

            {/* Wishlist Icon - Always visible */}
            <Link
              to="/user/wishlist"
              className="rounded-xl p-1.5 sm:p-2 md:p-2.5 text-gray-700 transition hover:bg-red-50 hover:text-red-500"
            >
              <FiHeart size={18} className="sm:w-5 sm:h-5" />
            </Link>

            {/* Cart Icon */}
            <button
              onClick={openCartDrawer}
              className="relative rounded-xl p-1.5 sm:p-2 md:p-2.5 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
            >
              <FiShoppingCart
                size={18}
                className="sm:w-5 sm:h-5 md:w-[22px] md:h-[22px]"
              />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] sm:h-5 sm:min-w-[20px] items-center justify-center rounded-full bg-red-500 px-0.5 text-[8px] sm:text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Profile Icon (Only when logged in) */}
            {isLoggedIn && (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center rounded-xl p-1.5 sm:p-2 md:p-2.5 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
                >
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                    {getUserInitials()}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 sm:mt-3 w-56 sm:w-64 overflow-hidden rounded-xl sm:rounded-2xl border border-gray-100 bg-white shadow-2xl z-50">
                    <div className="border-b bg-gradient-to-r from-gray-50 to-white px-3 py-3 sm:px-4 sm:py-4">
                      <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                        {user?.name || "User Account"}
                      </p>
                      <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-500 truncate">
                        {user?.email || "Manage your profile"}
                      </p>
                    </div>
                    <div className="p-1 sm:p-2">
                      <Link
                        to="/user/dashboard"
                        className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-700 transition hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiGrid size={14} />
                        <span>Dashboard</span>
                      </Link>
                      <Link
                        to="/user/orders"
                        className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-700 transition hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiPackage size={14} />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/user/wishlist"
                        className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-700 transition hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiHeart size={14} />
                        <span>Wishlist</span>
                      </Link>
                      <Link
                        to="/user/profile"
                        className="flex items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm text-gray-700 transition hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiUser size={14} />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 sm:gap-3 rounded-lg sm:rounded-xl px-2 py-2 sm:px-3 sm:py-3 text-xs sm:text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <FiLogOut size={14} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Login/Signup Buttons (Only when NOT logged in) */}
            {!isLoggedIn && (
              <div className="hidden sm:flex items-center gap-1 sm:gap-2">
                <Link
                  to="/login"
                  className="rounded-lg sm:rounded-xl px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg sm:rounded-xl bg-blue-600 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="lg:hidden px-3 pb-3 border-b bg-white">
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search laptops..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-9 pr-16 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                autoFocus
              />
              <button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-700 transition"
              >
                Go
              </button>
            </div>
          </div>
        )}

        {/* Desktop Navigation */}
        <div className="hidden lg:block border-t">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-4 text-sm font-semibold transition ${
                  isActive(link.path)
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full bg-blue-600"></span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Mobile Menu - Only navigation links, NO profile */}
        <div
          className={`overflow-hidden border-t bg-white transition-all duration-300 lg:hidden ${
            isMenuOpen ? "max-h-[400px]" : "max-h-0"
          }`}
        >
          <div className="space-y-1 px-3 py-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center justify-between rounded-lg px-3 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50 text-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{link.name}</span>
                <FiChevronRight size={14} />
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Overlay */}
      {(isCartOpen || isMenuOpen || mobileSearchOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => {
            setIsCartOpen(false);
            setIsMenuOpen(false);
            setMobileSearchOpen(false);
          }}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-sm sm:max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b bg-white px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Shopping Cart
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-lg p-1.5 sm:p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-3 sm:mb-4 rounded-full bg-gray-100 p-4 sm:p-6">
                <FiShoppingCart size={40} className="text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                Cart is empty
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500">
                You haven't added any laptop yet.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/products");
                }}
                className="mt-4 sm:mt-6 rounded-lg sm:rounded-xl bg-blue-600 px-4 py-2 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="group flex gap-2 sm:gap-3 rounded-xl sm:rounded-2xl border border-gray-200 bg-white p-2 sm:p-3 transition hover:shadow-md"
                >
                  <img
                    src={getImageUrl(item.images?.[0])}
                    alt={item.title}
                    className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg sm:rounded-xl border object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-xs sm:text-sm font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-gray-500">
                      {item.brand} {item.model}
                    </p>
                    <p className="mt-1.5 sm:mt-3 text-sm sm:text-base font-bold text-blue-600">
                      Rs {Number(item.price || 0).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="self-start rounded-lg p-1.5 sm:p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t bg-white p-3 sm:p-4">
            <div className="mb-2 sm:mb-4 rounded-xl sm:rounded-2xl bg-gray-50 p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-600">
                  Subtotal
                </span>
                <span className="text-lg sm:text-2xl font-bold text-gray-900">
                  Rs {totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-gray-500">
                Shipping calculated at checkout.
              </p>
            </div>
            <button
              className="mb-2 sm:mb-3 w-full rounded-lg sm:rounded-xl border border-gray-300 bg-white py-2 sm:py-3 text-xs sm:text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              onClick={handleViewCart}
            >
              View Cart
            </button>
            <button
              className="w-full rounded-lg sm:rounded-xl bg-gray-900 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-blue-600"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
