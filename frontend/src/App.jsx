import React from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import UserLayout from "./pages/users/UserLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { Toaster } from "react-hot-toast";

// Public Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductDetail from "./pages/admin/products/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// User Pages
import UserDashboard from "./pages/users/UserDashboard";
import UserOrders from "./pages/users/UserOrders";
import UserOrderDetails from "./pages/users/UserOrderDetails";
import UserProfile from "./pages/users/UserProfile";
import UserWishlist from "./pages/users/UserWishlist";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddLaptop from "./pages/admin/products/AddLaptop";
import ViewProducts from "./pages/admin/products/ViewProducts";
import ProductCard from "./components/admin/ProductCard";
import EditLaptop from "./pages/admin/products/EditLaptop";
import NoteFound from "./components/NotFound";
import UsersManagement from "./pages/admin/users/UsersManagement";
import OrdersManagement from "./pages/admin/orders/OrdersManagement";
import OrderDetails from "./pages/admin/orders/OrderDetails";
import ManageContacts from "./pages/admin/ManageContacts";
import ManageReviews from "./pages/admin/ManageReviews";
import ManageTestimonials from "./pages/admin/ManageTestimonials";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // Public Routes
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      { path: "contact", element: <Contact /> },
      { path: "about", element: <About /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "cart", element: <Cart /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "order-success", element: <OrderSuccess /> },
      { path: "product/:id", element: <ProductDetail /> },
      { path: "checkout", element: <Checkout /> },
    ],
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute allowedRoles={["User", "Admin"]}>
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/user/dashboard" replace /> },
      { path: "dashboard", element: <UserDashboard /> },
      { path: "orders", element: <UserOrders /> },
      { path: "orders/:id", element: <UserOrderDetails /> },
      { path: "profile", element: <UserProfile /> },
      { path: "wishlist", element: <UserWishlist /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["Admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "add-laptop", element: <AddLaptop /> },
      { path: "edit-laptop/:id", element: <EditLaptop /> },
      { path: "view-products", element: <ViewProducts /> },
      { path: "product-card", element: <ProductCard /> },
      { path: "users", element: <UsersManagement /> },
      { path: "orders", element: <OrdersManagement /> },
      { path: "orders/:id", element: <OrderDetails /> },
      { path: "manage-contacts", element: <ManageContacts /> },
      { path: "reviews", element: <ManageReviews /> },
      { path: "testimonials", element: <ManageTestimonials /> },
    ],
  },
  {
    path: "*",
    element: <NoteFound />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "12px",
            padding: "12px 20px",
            fontSize: "14px",
            fontWeight: "500",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
            style: {
              background: "linear-gradient(135deg, #065f46, #10b981)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
            style: {
              background: "linear-gradient(135deg, #991b1b, #ef4444)",
              color: "#fff",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            },
          },
          loading: {
            style: {
              background: "#1f2937",
              color: "#fff",
              border: "1px solid #3b82f6",
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
