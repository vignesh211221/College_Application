import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/timetable"; // Change to your backend URL

// Create a new timetable
export const createTimetable = async (data) => {
  return await axios.post(`${API_BASE_URL}`, data);
};

// Get all timetables
export const getAllTimetables = async () => {
  return await axios.get(`${API_BASE_URL}`);
};

// Get a specific timetable by ID
export const getTimetableById = async (id) => {
  return await axios.get(`${API_BASE_URL}/${id}`);
};

// Update a timetable by ID
export const updateTimetable = async (id, updatedData) => {
  return await axios.put(`${API_BASE_URL}/${id}`, updatedData);
};

// Delete a timetable by ID
export const deleteTimetable = async (id) => {
  return await axios.delete(`${API_BASE_URL}/${id}`);
};

// Update timetable based on staffId and day
export const updateTimetableByStaffAndDay = async (staffId, day, updatedData) => {
  return await axios.put(`${API_BASE_URL}/${staffId}/${day}`, updatedData);
};

export const getTimetableByStaffId = async (staffId) => {
  return await axios.get(`${API_BASE_URL}/staff/${staffId}`);
};

// 🆕 Get periods for a staff on a specific day
export const getPeriodsByStaffAndDay = async (staffId, day) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${staffId}/${day}`);
    return response.data; // { periods: [...] }
  } catch (error) {
    throw error.response?.data || { success: false, error: error.message };
  }
};
