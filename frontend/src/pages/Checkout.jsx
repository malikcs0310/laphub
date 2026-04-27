import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  FiTruck,
  FiMapPin,
  FiPhone,
  FiUser,
  FiMail,
  FiDollarSign,
  FiArrowLeft,
  FiClock,
  FiPackage,
  FiCreditCard,
  FiShield,
  FiCheckCircle,
  FiShoppingCart,
} from "react-icons/fi";
import { getCartItems, clearCart } from "../utils/cartUtils";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cod");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    return `${API_URL}/uploads/${imagePath}`;
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("product");

    if (productId) {
      fetchProductById(productId);
    } else {
      const items = getCartItems();
      if (items.length === 0) {
        toast.error("Your cart is empty");
        navigate("/cart");
      }
      setCartItems(items);
    }
  }, [location, navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsLoggedIn(true);
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      setFormData((prev) => ({
        ...prev,
        fullName: parsedUser.name || "",
        email: parsedUser.email || "",
        phone: parsedUser.phone || "",
      }));
    } else {
      navigate("/login", { state: { from: "/checkout" } });
      toast.error("Please login to checkout");
    }
  }, [navigate]);

  const fetchProductById = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/laptops/${id}`);
      const data = await res.json();
      setCartItems([{ ...data, quantity: 1 }]);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Name must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^03\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Enter valid Pakistani number (03xxxxxxxxx)";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.length < 10) {
      newErrors.address = "Please enter your complete address";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handlePaymentMethodChange = (method) => {
    setSelectedPaymentMethod(method);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const outOfStockItems = cartItems.filter((item) => item.stock <= 0);
    if (outOfStockItems.length > 0) {
      toast.error(
        `${outOfStockItems.length} item(s) are out of stock. Please remove them from cart.`,
      );
      return;
    }

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    const subtotal = cartItems.reduce((total, item) => {
      const price = Number(item.price);
      const quantity = item.quantity || 1;
      return total + (isNaN(price) ? 0 : price * quantity);
    }, 0);
    const shipping = subtotal > 50000 ? 0 : 300;
    const total = subtotal + shipping;

    const orderData = {
      items: cartItems.map((item) => ({
        productId: item._id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
        image: item.images?.[0],
        processor: item.processor,
        ram: item.ram,
        storage: item.storage,
        generation: item.generation,
      })),
      subtotal,
      shipping,
      total,
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      notes: formData.notes,
      paymentMethod: selectedPaymentMethod,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to place order");
      }

      clearCart();
      toast.success("Order placed successfully!");
      setTimeout(
        () => navigate("/order-success", { state: { order: data.order } }),
        1500,
      );
    } catch (error) {
      console.error("Order error:", error);
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const numPrice = Number(price);
    if (isNaN(numPrice)) return "Rs 0";
    return `Rs ${numPrice.toLocaleString()}`;
  };

  const subtotal = cartItems.reduce((total, item) => {
    const price = Number(item.price);
    const quantity = item.quantity || 1;
    return total + (isNaN(price) ? 0 : price * quantity);
  }, 0);
  const shipping = subtotal > 50000 ? 0 : 300;
  const total = subtotal + shipping;
  const remainingForFreeShipping = subtotal > 50000 ? 0 : 50000 - subtotal;
  const itemCount = cartItems.reduce(
    (count, item) => count + (item.quantity || 1),
    0,
  );

  // Early return if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
              <FiShoppingCart className="text-gray-400 text-3xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Add some products to your cart before checkout.
            </p>
            <Link
              to="/products"
              className="inline-flex bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-3 sm:mb-4 transition group text-sm sm:text-base"
          >
            <FiArrowLeft
              className="mr-1 sm:mr-2 group-hover:-translate-x-1 transition-transform"
              size={14}
            />
            Back to Cart
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1 sm:mt-2">
            Complete your order by filling the details below
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
          <div className="lg:flex-[2] space-y-5 sm:space-y-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 sm:p-3 rounded-xl mr-3 sm:mr-4">
                  <FiTruck className="text-white text-base sm:text-xl" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                    Delivery Information
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Enter your shipping details
                  </p>
                </div>
              </div>

              <form
                onSubmit={handlePlaceOrder}
                className="space-y-4 sm:space-y-5"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      <FiUser
                        className="inline mr-1 sm:mr-2 text-gray-400"
                        size={12}
                      />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border ${
                        errors.fullName ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                      placeholder="Muhammad Usama"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      <FiMail
                        className="inline mr-1 sm:mr-2 text-gray-400"
                        size={12}
                      />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                      placeholder="usama@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <FiPhone
                      className="inline mr-1 sm:mr-2 text-gray-400"
                      size={12}
                    />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border ${
                      errors.phone ? "border-red-500" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                    placeholder="03xxxxxxxxx"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    <FiMapPin
                      className="inline mr-1 sm:mr-2 text-gray-400"
                      size={12}
                    />
                    Street Address
                  </label>
                  <textarea
                    name="address"
                    rows={2}
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border ${
                      errors.address ? "border-red-500" : "border-gray-200"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm`}
                    placeholder="House #, Street, Area"
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs sm:text-sm text-red-500">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border ${
                        errors.city ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                      placeholder="Lahore"
                    />
                    {errors.city && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">
                        {errors.city}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border ${
                        errors.postalCode ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm`}
                      placeholder="54000"
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500">
                        {errors.postalCode}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    rows={2}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                    placeholder="Special instructions for delivery..."
                  />
                </div>

                <div className="border-t pt-4 sm:pt-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Payment Method
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <label
                      className={`flex items-center p-3 sm:p-4 border rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                        selectedPaymentMethod === "cod"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={selectedPaymentMethod === "cod"}
                        onChange={() => handlePaymentMethodChange("cod")}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                      />
                      <div className="ml-3 sm:ml-4 flex-1">
                        <div className="flex items-center">
                          <FiDollarSign
                            className="text-green-600 mr-1 sm:mr-2"
                            size={14}
                          />
                          <span className="font-medium text-sm sm:text-base">
                            Cash on Delivery
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                          Pay with cash when your order arrives
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center p-3 sm:p-4 border rounded-lg sm:rounded-xl cursor-pointer transition-all ${
                        selectedPaymentMethod === "card"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={selectedPaymentMethod === "card"}
                        onChange={() => handlePaymentMethodChange("card")}
                        className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600"
                      />
                      <div className="ml-3 sm:ml-4 flex-1">
                        <div className="flex items-center">
                          <FiCreditCard
                            className="text-purple-600 mr-1 sm:mr-2"
                            size={14}
                          />
                          <span className="font-medium text-sm sm:text-base">
                            Credit / Debit Card
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
                          Pay securely via card (Visa, Mastercard)
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:flex-1">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 sticky top-24 border border-gray-100">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 pb-2 border-b">
                <FiPackage className="text-blue-600" size={16} />
                Order Summary ({itemCount} {itemCount === 1 ? "item" : "items"})
              </h2>

              <div className="space-y-3 sm:space-y-4 max-h-60 sm:max-h-80 overflow-y-auto mb-3 sm:mb-4">
                {cartItems && cartItems.length > 0 ? (
                  cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="flex gap-2 sm:gap-3 pb-3 sm:pb-4 border-b"
                    >
                      <img
                        src={
                          item.images && item.images.length > 0
                            ? getImageUrl(item.images[0])
                            : "https://via.placeholder.com/60x60?text=No+Image"
                        }
                        alt={item.title}
                        className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://via.placeholder.com/60x60?text=No+Image";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2">
                          {item.title.length > 40
                            ? `${item.title.substring(0, 40)}...`
                            : item.title}
                        </h3>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {item.processor && (
                            <span className="text-[8px] sm:text-[9px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                              {item.processor.substring(0, 15)}
                            </span>
                          )}
                          {item.ram && (
                            <span className="text-[8px] sm:text-[9px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded">
                              {item.ram}
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <p className="text-xs sm:text-sm font-semibold text-blue-600">
                            {formatPrice(item.price)}
                          </p>
                          <p className="text-[10px] sm:text-xs text-gray-500">
                            Qty: {item.quantity || 1}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No items in cart
                  </div>
                )}
              </div>

              <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t">
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-sm sm:text-base">
                  <div className="flex items-center gap-1">
                    <FiTruck size={12} />
                    <span>Shipping</span>
                  </div>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>

                {remainingForFreeShipping > 0 && (
                  <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 sm:gap-2 text-blue-700">
                      <FiTruck size={12} />
                      <span className="font-medium">
                        Add {formatPrice(remainingForFreeShipping)} more for
                        free shipping
                      </span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-1 mt-1.5">
                      <div
                        className="bg-blue-600 h-1 rounded-full transition-all"
                        style={{
                          width: `${Math.min((subtotal / 50000) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 pt-2 sm:pt-3 border-t">
                  <span>Total</span>
                  <span className="text-xl sm:text-2xl text-blue-600">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    Placing Order...
                  </div>
                ) : (
                  `Place Order ${selectedPaymentMethod === "cod" ? "(Cash on Delivery)" : "(Card Payment)"}`
                )}
              </button>

              <div className="mt-3 sm:mt-4 flex items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-gray-500">
                <FiClock size={10} />
                <span>Estimated delivery: 3-5 business days</span>
              </div>

              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-[10px] sm:text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <FiShield size={10} /> Secure Checkout
                  </span>
                  <span className="flex items-center gap-1">
                    <FiTruck size={10} /> Free Shipping Over Rs 50k
                  </span>
                  <span className="flex items-center gap-1">
                    <FiCheckCircle size={10} /> 1 Year Warranty
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
