import axios from "axios";

// Base URL for your backend server (update if hosted on production)
const API = axios.create({
  baseURL: "http://localhost:5000/api/students",
});

// Get all students
export const getStudents = () => API.get("/");

// Get student by ID
export const getStudentById = (id) => API.get(`/${id}`);

// Get students by department
export const getStudentsByDepartment = (department) =>
  API.get(`/department/${department}`);

// Create new student
export const createStudent = (data) => API.post("/create", data);

// Update student by ID
export const updateStudent = (id, data) => API.put(`/${id}`, data);

// Delete student by ID
export const deleteStudent = (id) => API.delete(`/${id}`);

export const getStudentsByClass = (className) => API.get(`/classname/${className}`);

export const getStudentFilters = () => API.get("/filters");

export const getPlacementsByStudent = (studentId) =>
  API.get(`/${studentId}/placements`);

// Apply for a placement by studentId and placementId
export const applyForPlacement = (studentId, placementId) =>
  API.post(`/placements/${studentId}/apply/${placementId}`);



export const uploadStudentFile = (studentId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  return API.post(`/upload/${studentId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const getUploadedFilesByDeptAndClass = (department, className) => {
  return API.get(`/files/${department}/${className}`);
}; 

// Update to use the same API instance
export const getClassNamesByDepartment = async (department) => {
  try {
    const response = await API.get(`/classes/${department}`); // Using the same instance
    return response;
  } catch (error) {
    console.error('Error fetching class names:', error);
    throw error;
  }
};

// Add this function
export const updateSelectionStatus = (studentId, status) => 
  API.put(`/${studentId}/selection`, { status });
