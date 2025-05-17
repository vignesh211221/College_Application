import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/staff-detail'; // Adjust the base URL as needed

// Create or update staff detail
export const createOrUpdateStaffDetail = async (staffData) => {
  const response = await axios.post(`${BASE_URL}/`, staffData);
  return response.data;
};

// Get all staff details
export const getAllStaffDetails = async () => {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
};

// Get staff details by class name
export const getStaffDetailsByClass = async (className) => {
  const response = await axios.get(`${BASE_URL}/class/${className}`);
  return response.data;
};

// Get staff detail by ID
export const getStaffDetailById = async (id) => {
  const response = await axios.get(`${BASE_URL}/${id}`);
  return response.data;
};

// Update staff detail by ID
export const updateStaffDetailById = async (id, updatedData) => {
  const response = await axios.put(`${BASE_URL}/${id}`, updatedData);
  return response.data;
};

// Delete staff detail by ID
export const deleteStaffDetailById = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`);
  return response.data;
};
