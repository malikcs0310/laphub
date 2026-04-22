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
  FiMail,
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
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
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
      {/* PURE HEADER - Fully Sticky */}
      <div className="sticky top-0 z-50">
        {/* Top Bar - Solid Color (Sticky bhi ho ga) */}
        <div className="hidden md:block bg-gray-900 text-gray-300 text-sm">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-6">
                <a
                  href="tel:+923104082056"
                  className="flex items-center gap-2 hover:text-white transition"
                >
                  <FiPhone size={13} />
                  <span>+92 310 408 2056</span>
                </a>
                <div className="flex items-center gap-2">
                  <FiMail size={13} />
                  <span>info@laphub.pk</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin size={13} />
                  <span>Lahore, Pakistan</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-green-400">
                  <HiOutlineDesktopComputer size={14} />
                  Premium Laptops
                </span>
                <span className="flex items-center gap-1">
                  <MdOutlineSecurity size={14} />
                  Secure Payments
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header - Transparent with Blur */}
        <div
          className={`transition-all duration-300 ${
            isScrolled
              ? "bg-white/95 backdrop-blur-md shadow-md"
              : "bg-white/80 backdrop-blur-sm"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                </button>
                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl">
                    <MdLaptop className="text-white text-xl" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900">
                      LapHub<span className="text-blue-600">.pk</span>
                    </h1>
                    <p className="text-[10px] text-gray-500 hidden sm:block">
                      Trusted Laptops Store
                    </p>
                  </div>
                </Link>
              </div>

              {/* Desktop Search */}
              <div className="hidden lg:flex flex-1 max-w-lg relative">
                <FiSearch
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search laptops, brands, specs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white/90 backdrop-blur-sm"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm transition"
                >
                  Search
                </button>
              </div>

              {/* Right Icons */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Mobile Search Toggle */}
                <button
                  onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <FiSearch size={18} />
                </button>

                {/* Wishlist */}
                <Link
                  to="/user/wishlist"
                  className="p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <FiHeart size={18} />
                </Link>

                {/* Cart */}
                <button
                  onClick={openCartDrawer}
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <FiShoppingCart size={18} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>

                {/* Profile / Login */}
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-1 p-1 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                        {getUserInitials()}
                      </div>
                    </button>

                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b bg-gray-50">
                          <p className="font-semibold text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link
                            to="/user/dashboard"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FiGrid size={16} /> Dashboard
                          </Link>
                          <Link
                            to="/user/orders"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FiPackage size={16} /> My Orders
                          </Link>
                          <Link
                            to="/user/wishlist"
                            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            onClick={() => setIsProfileOpen(false)}
                          >
                            <FiHeart size={16} /> Wishlist
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <FiLogOut size={16} /> Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="hidden sm:flex items-center gap-2">
                    <Link
                      to="/login"
                      className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                    >
                      Signup
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Search Bar */}
            {mobileSearchOpen && (
              <div className="lg:hidden mt-3">
                <div className="relative">
                  <FiSearch
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search laptops..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-9 pr-16 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white/90 backdrop-blur-sm"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Go
                  </button>
                </div>
              </div>
            )}

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 border-t border-gray-200/50 mt-3 pt-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                    isActive(link.path)
                      ? "text-blue-600 bg-blue-50/80 backdrop-blur-sm"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-100/80"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 bg-white/95 backdrop-blur-md border-t ${
            isMenuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center justify-between py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{link.name}</span>
                <FiChevronRight size={16} />
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="pt-2 border-t mt-2">
                <Link
                  to="/login"
                  className="block py-3 px-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block py-3 px-2 bg-blue-600 text-white rounded-lg mt-1 text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cart Drawer */}
      <div
        className={`fixed right-0 top-0 z-[60] h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold">Your Cart ({cartCount})</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FiShoppingCart size={48} className="text-gray-300 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <button
                onClick={() => navigate("/products")}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3 border-b pb-3">
                  <img
                    src={getImageUrl(item.images?.[0])}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Rs {Number(item.price).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cartItems.length > 0 && (
          <div className="p-4 border-t">
            <div className="flex justify-between mb-3">
              <span className="font-medium">Total</span>
              <span className="font-bold text-lg">
                Rs {totalPrice.toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleViewCart}
              className="w-full bg-blue-600 text-white py-2 rounded-lg mb-2"
            >
              View Cart
            </button>
            <button
              onClick={handleCheckout}
              className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg"
            >
              Checkout
            </button>
          </div>
        )}
      </div>

      {/* Overlay */}
      {(isCartOpen || isMenuOpen || mobileSearchOpen) && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => {
            setIsCartOpen(false);
            setIsMenuOpen(false);
            setMobileSearchOpen(false);
          }}
        />
      )}
    </>
  );
};

export default Header;
