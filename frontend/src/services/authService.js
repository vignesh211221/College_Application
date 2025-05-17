import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register method
const register = async (username, email, password, role) => {
  return axios.post(`${API_URL}/register`, { username, email, password, role });
};

// Login method
const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });

    // Store necessary values in localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("username", response.data.username);
    localStorage.setItem("staffId", response.data.staffId);
    localStorage.setItem("userId", response.data.userId);
    localStorage.setItem("studentId", response.data.studentId);
    localStorage.setItem("user", JSON.stringify(response.data)); // Store full user data

    return response.data;
  } catch (error) {
    console.error("AuthService Login Error:", error.response?.data || error.message);

    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || "Login failed. Please try again.");
    }

    throw new Error("Network error. Please try again later.");
  }
};

// Forgot password method
const forgotPassword = async (email) => {
  return axios.post(`${API_URL}/forgot-password`, { email });
};

// Reset password method
const resetPassword = async (token, password) => {
  return axios.put(`${API_URL}/reset-password/${token}`, { password });
};

// Getters for localStorage data
const getToken = () => {
  return localStorage.getItem("token");
};

const getUsername = () => {
  return localStorage.getItem("username");
};

const getStaffId = () => {
  return localStorage.getItem("staffId");
};

const getUserId = () => {
  return localStorage.getItem("userId"); // Getter for userId
};

const getStudentId = () => {
    return localStorage.getItem("studentId");
  };
  

export default {
  register,
  login,
  forgotPassword,
  resetPassword,
  getToken,
  getUsername,
  getStaffId,
  getUserId, 
  getStudentId,
};
