import axios from "axios";

// Base URL for your backend server (update if hosted on production)
const API = axios.create({
  baseURL: "http://localhost:5000/api/staff",
});

// Get all staff
export const getStaff = () => API.get("/");

// Get staff by ID
export const getStaffById = (id) => API.get(`/${id}`);

// Get staff by department
export const getStaffByDepartment = (department) =>
  API.get(`/department/${department}`);

// Create new staff
export const createStaff = (data) => API.post("/create", data);

// Update staff by ID
export const updateStaff = (id, data) => API.put(`/${id}`, data);

// Delete staff by ID
export const deleteStaff = (id) => API.delete(`/${id}`);

// Assign HOD role to staff
export const assignHODRole = (id) => API.put(`/assign-hod-role/${id}`);

// Remove HOD role
export const removeHODRole = (id) => API.put(`/remove-hod/${id}`);

// Get students by staff ID
export const getStudentsByStaffId = (id) => API.get(`/${id}/students`);

// Assign Placement Officer role to staff
export const assignPlacementOfficer = (id) => API.put(`/assign-placement-officer/${id}`);

// Remove Placement Officer role
export const removePlacementOfficer = (id) => API.put(`/remove-placement-officer/${id}`);

// Assign Placement Coordinator role to staff
export const assignPlacementCoordinator = (id) => API.put(`/assign-placement-coordinator/${id}`);

// Remove Placement Coordinator role
export const removePlacementCoordinator = (id) => API.put(`/remove-placement-coordinator/${id}`);
