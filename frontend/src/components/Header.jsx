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

  const navigate = useNavigate();
  const location = useLocation();

  const loadCartItems = useCallback(() => {
    setCartItems(getCartItems());
  }, []);

  const handleRemove = useCallback((id) => {
    const updatedCart = removeFromCart(id);
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("cartUpdated"));
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

  // Check login status and get user data
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
    if (isCartOpen || isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen, isMenuOpen]);

  const handleSearch = useCallback(() => {
    const value = searchTerm.trim();
    if (!value) {
      navigate("/products");
      setIsMenuOpen(false);
      return;
    }

    navigate(`/products?search=${encodeURIComponent(value)}`);
    setIsMenuOpen(false);
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
    navigate("/");
  }, [navigate]);

  const getImageUrl = useCallback((imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/100x80?text=No+Image";
    const apiUrl = import.meta.env.VITE_API_URL || "";
    return `${apiUrl}/uploads/${imagePath}`;
  }, []);

  const isActive = (path) => location.pathname === path;

  // Get user initials for avatar
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
        {/* Top Bar */}
        <div className="hidden md:block border-b bg-gray-950 text-gray-300">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-sm">
            <div className="flex items-center gap-6">
              <a
                href="tel:+923104082056"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <FiPhone size={14} />
                <span>+92 310 4082056</span>
              </a>

              <div className="flex items-center gap-2">
                <FiMapPin size={14} />
                <span>Lahore, Pakistan</span>
              </div>
            </div>

            <div className="flex items-center gap-6 text-xs lg:text-sm">
              <span className="flex items-center gap-2 text-green-400">
                <HiOutlineDesktopComputer size={15} />
                Premium Laptops
              </span>
              <span className="flex items-center gap-2">
                <MdOutlineSecurity size={15} />
                Secure Payments
              </span>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-xl p-2 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600 lg:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>

            <Link
              to="/"
              className="group flex items-center gap-3"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 p-3 shadow-md transition duration-300 group-hover:scale-105 group-hover:shadow-lg">
                <MdLaptop className="text-white" size={28} />
              </div>

              <div>
                <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
                  LapHub<span className="text-blue-600">.pk</span>
                </h1>
                <p className="hidden text-xs text-gray-500 sm:block">
                  Trusted Laptops Store
                </p>
              </div>
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8 relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search laptops, brands, specs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-28 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              aria-label="Search products"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 hover:scale-105"
              aria-label="Search"
            >
              Search
            </button>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/user/wishlist"
              className="hidden rounded-xl p-2.5 text-gray-700 transition hover:bg-red-50 hover:text-red-500 sm:flex"
              aria-label="Wishlist"
            >
              <FiHeart size={21} />
            </Link>

            {isLoggedIn ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center justify-center rounded-xl p-2.5 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
                  aria-label="Profile menu"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                    {getUserInitials()}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl z-50">
                    <div className="border-b bg-gradient-to-r from-gray-50 to-white px-4 py-4">
                      <p className="text-sm font-bold text-gray-900">
                        {user?.name || "User Account"}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        {user?.email || "Manage your profile"}
                      </p>
                    </div>

                    <div className="p-2">
                      <Link
                        to="/user/dashboard"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiGrid size={18} />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        to="/user/orders"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiPackage size={18} />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/user/wishlist"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiHeart size={18} />
                        <span>Wishlist</span>
                      </Link>

                      <Link
                        to="/user/profile"
                        className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-700 transition hover:bg-gray-50"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <FiUser size={18} />
                        <span>Profile Settings</span>
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <FiLogOut size={18} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden items-center gap-2 lg:flex">
                <Link
                  to="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Signup
                </Link>
              </div>
            )}

            <button
              onClick={openCartDrawer}
              className="relative rounded-xl p-2.5 text-gray-700 transition hover:bg-gray-100 hover:text-blue-600"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <FiShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden border-t lg:block">
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

        {/* Mobile Search */}
        <div className="lg:hidden px-4 pb-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search laptops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-24 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search products"
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              aria-label="Search"
            >
              Search
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`overflow-hidden border-t bg-white transition-all duration-300 lg:hidden ${
            isMenuOpen ? "max-h-[500px]" : "max-h-0"
          }`}
        >
          <div className="space-y-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center justify-between rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{link.name}</span>
                <FiChevronRight size={16} />
              </Link>
            ))}

            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <div className="border-b pb-2 mb-2">
                  <p className="font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  to="/user/dashboard"
                  className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/user/orders"
                  className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Orders
                </Link>
                <Link
                  to="/user/wishlist"
                  className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link
                  to="/user/profile"
                  className="block rounded-xl px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-xl px-4 py-3 text-left font-medium text-red-600 transition hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Overlay */}
      {(isCartOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={() => {
            setIsCartOpen(false);
            setIsMenuOpen(false);
          }}
        />
      )}

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 z-[60] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="border-b bg-white px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <p className="mt-1 text-sm text-gray-500">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </p>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="rounded-xl p-2 text-gray-600 transition hover:bg-gray-100 hover:text-black"
              aria-label="Close cart"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-6">
                <FiShoppingCart size={52} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Cart is empty</h3>
              <p className="mt-2 max-w-xs text-sm text-gray-500">
                You haven’t added any laptop yet. Start exploring products.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/products");
                }}
                className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="group flex gap-3 rounded-2xl border border-gray-200 bg-white p-3 transition hover:shadow-md"
                >
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? `http://localhost:5000/uploads/${item.images[0]}`
                        : "https://via.placeholder.com/100x80?text=No+Image"
                    }
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      {item.brand} {item.model}
                    </p>

                    <p className="mt-3 text-base font-bold text-blue-600">
                      Rs {Number(item.price || 0).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleRemove(item._id)}
                    className="self-start rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700"
                    aria-label="Remove item"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="border-t bg-white p-4">
            <div className="mb-4 rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600">
                  Subtotal
                </span>
                <span className="text-2xl font-bold text-gray-900">
                  Rs {totalPrice.toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Shipping and taxes will be calculated at checkout.
              </p>
            </div>

            <button
              className="mb-3 w-full rounded-xl border border-gray-300 bg-white py-3 font-semibold text-gray-800 transition hover:bg-gray-50"
              onClick={handleViewCart}
            >
              View Cart
            </button>

            <button
              className="w-full rounded-xl bg-gray-900 py-3 font-semibold text-white transition hover:bg-blue-600"
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
