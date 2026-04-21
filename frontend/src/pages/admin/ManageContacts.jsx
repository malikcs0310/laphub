import React, { useEffect, useState } from "react";
import { getAllMessages, deleteMessage } from "../../services/contactService";
import {
  FiRefreshCw,
  FiTrash2,
  FiMail,
  FiUser,
  FiMessageSquare,
  FiCalendar,
} from "react-icons/fi";
import toast from "react-hot-toast";

const ManageContacts = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const data = await getAllMessages(token);

      if (data.contacts) {
        setMessages(data.contacts);
      } else if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?"))
      return;

    try {
      const token = localStorage.getItem("adminToken");
      await deleteMessage(id, token);
      setMessages(messages.filter((msg) => msg._id !== id));
      toast.success("Message deleted successfully!");
    } catch (err) {
      console.error("Error deleting message:", err);
      toast.error("Failed to delete message!");
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-PK", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 sm:p-8 text-center">
        <svg
          className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-base sm:text-lg font-medium text-gray-900">
          Error loading messages
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">{error}</p>
        <button
          onClick={fetchMessages}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-3 sm:p-4 md:p-6 bg-white shadow-lg rounded-lg sm:rounded-xl border border-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Contact Messages
          </h2>
          <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1">
            Messages from customers who contacted through the website
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700 text-sm"
        >
          <FiRefreshCw size={12} className="sm:w-3.5 sm:h-3.5" />
          Refresh
        </button>
      </div>

      {/* Empty State */}
      {messages.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <FiMail className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No messages
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            No contact messages received yet.
          </p>
        </div>
      ) : (
        <>
          {/* Messages Table - Horizontal scroll on mobile */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] sm:min-w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase">
                    #
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase">
                    Subject
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase">
                    Message
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[9px] sm:text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {messages.map((msg, index) => (
                  <tr key={msg._id} className="hover:bg-gray-50 transition">
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-[10px] sm:text-xs text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <FiUser
                          size={10}
                          className="sm:w-3 sm:h-3 text-gray-400"
                        />
                        <span className="text-[10px] sm:text-xs font-medium text-gray-900">
                          {msg.name?.length > 20
                            ? `${msg.name.substring(0, 20)}...`
                            : msg.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <p className="text-[10px] sm:text-xs text-gray-600 truncate max-w-[100px] sm:max-w-[150px]">
                        {msg.email}
                      </p>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <p className="text-[10px] sm:text-xs text-gray-600 truncate max-w-[80px] sm:max-w-[120px]">
                        {msg.subject}
                      </p>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="text-[10px] sm:text-xs text-gray-600 max-w-[150px] sm:max-w-[200px] md:max-w-[300px] break-words line-clamp-2">
                        {msg.message}
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <div className="flex items-center gap-1">
                        <FiCalendar
                          size={8}
                          className="sm:w-2.5 sm:h-2.5 text-gray-400"
                        />
                        <span className="text-[9px] sm:text-[10px] text-gray-500">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3">
                      <button
                        onClick={() => handleDelete(msg._id)}
                        className="text-red-600 hover:text-red-800 transition p-1 rounded hover:bg-red-50"
                        title="Delete message"
                      >
                        <FiTrash2 size={12} className="sm:w-3.5 sm:h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stats */}
          <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
            <p className="text-[10px] sm:text-xs text-gray-500">
              Total messages:{" "}
              <span className="font-semibold text-gray-700">
                {messages.length}
              </span>
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ManageContacts;
