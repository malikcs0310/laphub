import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ✅ Send Contact Message (Public)
export const sendContactMessage = async (formData) => {
  try {
    const response = await axios.post(`${API_URL}/api/contact`, formData);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Something went wrong!"
    );
  }
};

// ✅ Get All Messages (Admin Panel)
export const getAllMessages = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/contact`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch messages!";
  }
};

// ✅ Get Message by ID (Admin Panel)
export const getMessageById = async (id, token) => {
  try {
    const response = await axios.get(`${API_URL}/api/contact/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch message!";
  }
};

// ✅ Update Message Status (Admin Panel)
export const updateMessageStatus = async (id, status, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/contact/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to update message!";
  }
};

// ✅ Delete a Message (Admin Panel)
export const deleteMessage = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/api/contact/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete message!";
  }
};

// ✅ Get Contact Statistics (Admin Panel)
export const getContactStats = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/api/contact/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch statistics!";
  }
};
