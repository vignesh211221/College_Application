import axios from 'axios';

// Base URL for the API
const API_URL = 'http://localhost:5000/api/student-timetable'; // Adjust to your backend URL

// Function to create a new timetable
export const createTimetable = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error creating timetable:', error);
    throw error;
  }
};

// Function to get all timetables
export const getAllTimetables = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching timetables:', error);
    throw error;
  }
};

// Function to get timetable by className and department
export const getTimetableByClass = async (className, department) => {
  try {
    const encodedClassName = encodeURIComponent(className);
    const encodedDepartment = encodeURIComponent(department);

    const response = await axios.get(`${API_URL}/${encodedClassName}/${encodedDepartment}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching timetable for ${className} and ${department}:`, error);
    throw error;
  }
};


// Function to update timetable for a class and day
export const updateTimetableByClassAndDay = async (className, department, day, data) => {
  try {
    const response = await axios.put(`${API_URL}/${className}/${department}/${day}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating timetable:', error);
    throw error;
  }
};

// Function to get periods for a class on a specific day
export const getPeriodsByClassAndDay = async (className, department, day) => {
  try {
    const response = await axios.get(`${API_URL}/${className}/${department}/${day}/periods`);
    return response.data;
  } catch (error) {
    console.error('Error fetching periods:', error);
    throw error;
  }
};
