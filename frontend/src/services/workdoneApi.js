// workdoneApi.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workdone'; // Adjust the base URL if needed

// Create a new WorkDone entry
export const createWorkDone = async (workDoneData) => {
  try {
    const response = await axios.post(`${API_URL}/`, workDoneData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get all WorkDone entries by timetable ID
export const getWorkDoneByTimetable = async (timetableId) => {
  try {
    const response = await axios.get(`${API_URL}/timetable/${timetableId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get a specific WorkDone entry by ID
export const getWorkDoneById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Update a WorkDone entry
export const updateWorkDone = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Delete a WorkDone entry
export const deleteWorkDone = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


// Get work done by staffId and day
export const getWorkDoneByStaffAndDay = async (staffId, day) => {
  try {
    const response = await axios.get(`${API_URL}/staff/${staffId}/day/${day}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

export const getWorkDoneByStaffAndDate = async (staffId, date) => {
  try {
    const response = await axios.get(`${API_URL}/by-date/${staffId}/${date}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};