import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    // Check if it's an admin token (from admin login)
    if (decoded.role === "admin") {
      console.log("✅ Admin token detected - skipping user DB check");
      req.user = {
        id: "admin",
        email: decoded.email,
        role: "Admin",
        isAdmin: true,
      };
      return next();
    }

    // For regular user tokens, check in database
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(401).json({ message: "User no longer exists." });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated." });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired. Please login again." });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
  console.log("AdminOnly check - User role:", req.user?.role);

  if (
    req.user &&
    (req.user.role === "Admin" || req.user.role === "admin" || req.user.isAdmin)
  ) {
    console.log("✅ Admin access granted");
    next();
  } else {
    console.log("❌ Admin access denied");
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};
