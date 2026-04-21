import React, { useState, useEffect } from "react";
import { FiUser, FiMail, FiPhone, FiSave, FiEdit2 } from "react-icons/fi";
import toast from "react-hot-toast";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setFormData({
        name: parsed.name || "",
        phone: parsed.phone || "",
      });
    }
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        const updatedUser = {
          ...user,
          name: formData.name,
          phone: formData.phone,
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile updated successfully!");
        setEditing(false);
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
        Profile Settings
      </h1>

      {/* Profile Card - Mobile Optimized */}
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-5 sm:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">
            Personal Information
          </h2>
          <button
            onClick={() => setEditing(!editing)}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-xs sm:text-sm"
          >
            <FiEdit2 size={12} className="sm:w-3.5 sm:h-3.5" />
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {/* View Mode - Mobile Optimized */}
        {!editing ? (
          <div className="space-y-3 sm:space-y-4">
            {/* Full Name */}
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
              <FiUser className="text-gray-400 text-sm sm:text-base" />
              <div className="flex-1">
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Full Name
                </p>
                <p className="font-medium text-gray-900 text-sm sm:text-base break-all">
                  {user.name}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
              <FiMail className="text-gray-400 text-sm sm:text-base" />
              <div className="flex-1">
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Email Address
                </p>
                <p className="font-medium text-gray-900 text-sm sm:text-base break-all">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl">
              <FiPhone className="text-gray-400 text-sm sm:text-base" />
              <div className="flex-1">
                <p className="text-[10px] sm:text-xs text-gray-500">
                  Phone Number
                </p>
                <p className="font-medium text-gray-900 text-sm sm:text-base">
                  {user.phone || "Not provided"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode - Mobile Optimized */
          <form onSubmit={handleUpdate} className="space-y-3 sm:space-y-4">
            {/* Full Name Input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                required
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="03xxxxxxxxx"
              />
              <p className="mt-1 text-[10px] sm:text-xs text-gray-500">
                Enter Pakistani number (03xxxxxxxxx)
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2 rounded-lg font-semibold transition disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
            >
              <FiSave size={14} className="sm:w-4 sm:h-4" />
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
