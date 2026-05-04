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

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ STEP 1: Try admin login first (using backend API only)
      let adminResponse = null;
      try {
        const adminRes = await fetch(`${API_URL}/api/auth/admin/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (adminRes.ok) {
          const adminData = await adminRes.json();
          localStorage.setItem("adminToken", adminData.token);
          localStorage.setItem("isAdmin", "true");
          navigate("/admin");
          setLoading(false);
          return;
        }
      } catch (adminErr) {
        // Admin login failed, continue to user login
        console.log("Not admin, trying user login...");
      }

      // ✅ STEP 2: If not admin, try regular user login
      const userRes = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const userData = await userRes.json();

      if (!userRes.ok) {
        throw new Error(userData.message || "Login failed");
      }

      // Save user data
      localStorage.setItem("token", userData.token);
      localStorage.setItem("user", JSON.stringify(userData.user));

      // Clear any admin data
      localStorage.removeItem("adminToken");
      localStorage.removeItem("isAdmin");

      // Redirect based on role
      if (userData.user?.role === "Admin") {
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
        </form>
      </div>
    </div>
  );
};

export default Login;
