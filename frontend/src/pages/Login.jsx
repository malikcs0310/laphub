import "../styles/Login.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Check if it's admin login
      if (email === "admin@laptopshop.com" && password === "admin123") {
        const adminRes = await fetch(
          "http://localhost:5000/api/auth/admin/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          },
        );

        const adminData = await adminRes.json();

        if (adminRes.ok) {
          localStorage.setItem("adminToken", adminData.token);
          localStorage.setItem("isAdmin", "true");
          navigate("/admin");
          setLoading(false);
          return;
        }
      }

      // User login
      const userRes = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const userData = await userRes.json();

      // DEBUG LOGS
      console.log("User login response:", userData);
      console.log("User role:", userData.user?.role);
      console.log("Token:", userData.token?.substring(0, 50) + "...");

      if (!userRes.ok) {
        throw new Error(userData.message || "Login failed");
      }

      // Check if role exists
      if (!userData.user?.role) {
        console.warn("No role found in user data, defaulting to User");
        userData.user.role = "User";
      }

      // Save user data
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));

      // DEBUG: Verify saved data
      console.log(
        "Saved to localStorage - token:",
        !!localStorage.getItem("token"),
      );
      console.log("Saved user:", localStorage.getItem("user"));

      // Clear any admin data
      localStorage.removeItem("adminToken");
      localStorage.removeItem("isAdmin");

      // Redirect based on role
      if (userData.user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="box">
        <form onSubmit={handleSubmit}>
          <h2 className="brand">LapHub.pk</h2>
          <p className="tagline">Welcome Back!</p>

          {error && (
            <div
              className="error-message"
              style={{ color: "red", marginBottom: "15px" }}
            >
              {error}
            </div>
          )}

          <div className="inputbox">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span>Email Address</span>
            <i></i>
          </div>

          <div className="inputbox">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span>Password</span>
            <i></i>
          </div>

          <div className="options">
            <label className="show-password">
              <input
                type="checkbox"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              Show Password
            </label>
            <a href="/forgot-password" className="forgot-link">
              Forgot Password?
            </a>
          </div>

          <input
            type="submit"
            value={loading ? "Logging in..." : "Login"}
            disabled={loading}
          />

          <div className="signup-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </div>

          <div className="demo-credentials">
            <div className="demo-title">Demo Credentials</div>
            <div className="demo-row">
              <span className="demo-role">Admin:</span>
              <span> admin@laptopshop.com </span>
              <span className="demo-pass">| admin123</span>
            </div>
            <div className="demo-row">
              <span className="demo-role">User:</span>
              <span> malikcs0310@gmail.com </span>
              <span className="demo-pass">| 98230910</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
