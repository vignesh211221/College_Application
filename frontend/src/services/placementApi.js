import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/placement'; // Adjust the base URL according to your backend

// Add auth token to headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Create a new placement
export const createPlacement = async (placementData) => {
  const response = await axios.post(API_BASE_URL, placementData, getAuthHeaders());
  return response.data;
};

// Get all placements
export const getAllPlacements = async () => {
  const response = await axios.get(API_BASE_URL, getAuthHeaders());
  return response.data;
};

// Update a placement by ID
export const updatePlacement = async (id, updatedData) => {
  const response = await axios.put(`${API_BASE_URL}/${id}`, updatedData, getAuthHeaders());
  return response.data;
};

// Delete a placement by ID
export const deletePlacement = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/${id}`, getAuthHeaders());
  return response.data;
};

// Get students who applied for a specific placement
export const getAppliedStudents = async (placementId) => {
  const response = await axios.get(`${API_BASE_URL}/${placementId}/applied-students`, getAuthHeaders());
  return response.data;
};


// Get applied students by department
export const getAppliedStudentsByDepartment = async (placementId, department) => {
  const response = await axios.get(
    `${API_BASE_URL}/${placementId}/applied-students/${department}`,
    getAuthHeaders()
  );
  return response.data;
};


export const getDepartmentWiseCount = async (placementId) => {
  const response = await axios.get(
    `${API_BASE_URL}/department-count/${placementId}`,
    getAuthHeaders()
  );
  return response.data;
};
export const updateSelectionStatus = async (studentId, status, placementId) => {
  const response = await axios.put(
    `${API_BASE_URL}/${studentId}/selection`,
    { status, placementId }, // ✅ Include placementId
    getAuthHeaders()
  );
  return response.data;
};
