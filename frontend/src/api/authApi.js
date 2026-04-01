import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Signup
export const signupUser = async (userData) => {
  const response = await api.post("/signup", userData);
  return response.data;
};

// Login
export const loginUser = async (credentials) => {
  const response = await api.post("/login", credentials);
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const response = await api.get("/me");
  return response.data;
};

// Update profile
export const updateProfile = async (userData) => {
  const response = await api.put("/profile", userData);
  return response.data;
};

// Change password
export const changePassword = async (passwords) => {
  const response = await api.put("/change-password", passwords);
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post("/forgot-password", { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await api.post(`/reset-password/${token}`, { password });
  return response.data;
};
