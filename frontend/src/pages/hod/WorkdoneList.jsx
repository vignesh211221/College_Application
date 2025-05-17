import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWorkDoneByStaffAndDate, deleteWorkDone } from "../../services/workdoneApi";
import axios from "axios";
import "../admin/StudentList.css";
import Navbar from "../../components/Navbar";

const StaffWorkDoneList = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [workDoneList, setWorkDoneList] = useState([]);
  const [staffName, setStaffName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [role, setRole] = useState("");

  useEffect(() => {
      const storedRole = localStorage.getItem("role"); // or fetch from user object
      setRole(storedRole);
    }, []);


  useEffect(() => {
    fetchWorkDone();
    fetchStaffName();
  }, [staffId, selectedDate]);

  const fetchWorkDone = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getWorkDoneByStaffAndDate(staffId, selectedDate);
      // Limit to 8 periods
      const limitedData = data.slice(0, 8);
      setWorkDoneList(limitedData);
    } catch (err) {
      setError(err.message || "Failed to load work done data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffName = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/staff/${staffId}`);
      setStaffName(res.data.user?.username || "Unknown");
    } catch (err) {
      setStaffName("Unknown");
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteWorkDone(id);
        fetchWorkDone(); // Refresh the list after deletion
      } catch (err) {
        alert("Failed to delete. Try again.");
      }
    }
  };

  const handleSubmitWorkDone = async (workData) => {
    if (workDoneList.length < 8) {
      try {
        await submitWorkDone(workData); // Your work done submission function
        fetchWorkDone(); // Refresh the list after submitting
      } catch (err) {
        alert("Error submitting work.");
      }
    } else {
      alert("Maximum 8 periods allowed for the selected date.");
    }
  };

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      <br />
      <button className="back-btn" onClick={() => window.history.back()}>
        Back
      </button>
      <button
        onClick={() => {
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "hod") {
            navigate("/hod-dashboard");
          } else {
            toast.error("Unauthorized role");
          }
        }}
        className="dash-btn"
      >
        Back to Dashboard
      </button>
      <br></br>
      <br></br>


      <div className="student-list-container">
        <h2 style={{ marginBottom: "1rem" }}>Work Done by {staffName}</h2>

        <div className="filter-controls">
          <label htmlFor="date">Select Date: </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
            max={new Date().toISOString().split("T")[0]}
          />
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : workDoneList.length === 0 ? (
          <p>No work done records found for {selectedDate}.</p>
        ) : (
          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Period Number</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Unit</th>
                  <th>Syllabus</th>
                  <th>Covered Topic</th>
                  <th>Completed Time</th>
                  <th>Submit Time & Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {workDoneList.map((work, index) => (
                  <tr key={index}>
                    <td>{work.periodNumber}</td>
                    <td>{work.class}</td>
                    <td>{work.subject}</td>
                    <td>{work.unit}</td>
                    <td>{work.syllabus}</td>
                    <td>{work.coveredTopic}</td>
                    <td>{work.completedTime}</td>
                    <td>{work.date}</td>
                    <td>
                      <button className="delete-btn" onClick={() => handleDelete(work._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffWorkDoneList;
