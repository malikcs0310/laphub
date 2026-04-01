import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      // Check both user token and admin token
      const userToken = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");
      const isAdmin = localStorage.getItem("isAdmin");

      // Admin login case
      if (adminToken && isAdmin === "true") {
        console.log("✅ Admin logged in");
        setUserRole("Admin");
        setIsAuthenticated(true);
        setLoading(false);
        return;
      }

      // User login case
      if (userToken) {
        try {
          const decoded = JSON.parse(atob(userToken.split(".")[1]));
          console.log("✅ User logged in, role:", decoded.role);
          setUserRole(decoded.role || "User");
          setIsAuthenticated(true);
        } catch (err) {
          console.error("Invalid token:", err);
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
        setLoading(false);
        return;
      }

      // No token found
      setIsAuthenticated(false);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, check role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Admin trying to access user page
    if (userRole === "Admin") {
      return <Navigate to="/admin" replace />;
    }
    // User trying to access admin page
    if (userRole === "User") {
      return <Navigate to="/" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
