import { useState, useEffect } from "react";
import {
  FiSearch,
  FiUser,
  FiMail,
  FiPhone,
  FiTrash2,
  FiRefreshCw,
  FiAlertCircle,
  FiUserCheck,
  FiUserX,
} from "react-icons/fi";
import toast from "react-hot-toast";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch users");
      }

      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleBlockUser = async (userId, currentStatus) => {
    if (
      !confirm(
        `Are you sure you want to ${currentStatus ? "block" : "unblock"} this user?`,
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}/block`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, isActive: !currentStatus } : user,
        ),
      );
      toast.success(data.message);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteUser = async (userId) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this user? This action cannot be undone!",
      )
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUsers(users.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`${API_URL}/api/admin/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user,
        ),
      );
      toast.success("User role updated successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.phone?.includes(searchTerm),
  );

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="mx-auto text-red-500 text-4xl mb-3" />
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchUsers}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Users Management
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1">
          View and manage all registered users
        </p>
      </div>

      {/* Search and Refresh Bar */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1 relative">
          <FiSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition"
        >
          <FiRefreshCw size={12} className="sm:w-3.5 sm:h-3.5" />
          Refresh
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] sm:min-w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  User
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Joined
                </th>
                <th className="px-3 sm:px-6 py-2 sm:py-3 text-right text-[10px] sm:text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50 transition">
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-xs sm:text-sm">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                          {user?.name?.length > 20
                            ? `${user.name.substring(0, 20)}...`
                            : user.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-400">
                          ID: {user?._id?.slice(-6)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <p className="text-xs sm:text-sm text-gray-900 truncate max-w-[120px] sm:max-w-none">
                      {user?.email}
                    </p>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <p className="text-xs sm:text-sm text-gray-900">
                      {user?.phone}
                    </p>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <select
                      value={user?.role || "User"}
                      onChange={(e) => updateUserRole(user._id, e.target.value)}
                      className="text-[10px] sm:text-sm border border-gray-300 rounded-md px-1.5 py-0.5 sm:px-2 sm:py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                    <span
                      className={`px-1.5 py-0.5 sm:px-2 sm:py-1 inline-flex text-[9px] sm:text-xs font-semibold rounded-full ${
                        user?.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user?.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-[10px] sm:text-xs text-gray-500">
                    {formatDate(user?.createdAt)}
                  </td>
                  <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-1 sm:gap-2">
                      <button
                        onClick={() =>
                          toggleBlockUser(user._id, user?.isActive)
                        }
                        className={`p-1 sm:p-1.5 rounded-md transition ${
                          user?.isActive
                            ? "text-red-600 hover:bg-red-50"
                            : "text-green-600 hover:bg-green-50"
                        }`}
                        title={user?.isActive ? "Block User" : "Unblock User"}
                      >
                        {user?.isActive ? (
                          <FiUserX size={12} className="sm:w-4 sm:h-4" />
                        ) : (
                          <FiUserCheck size={12} className="sm:w-4 sm:h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="p-1 sm:p-1.5 text-red-600 hover:bg-red-50 rounded-md transition"
                        title="Delete User"
                      >
                        <FiTrash2 size={12} className="sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <FiAlertCircle className="mx-auto text-gray-400 text-3xl sm:text-5xl" />
            <h3 className="mt-2 sm:mt-4 text-base sm:text-lg font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">
              Try adjusting your search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
