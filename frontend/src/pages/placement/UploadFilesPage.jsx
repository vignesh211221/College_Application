import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getUploadedFilesByDeptAndClass } from "../../services/studentApi";
import "../admin/StudentList.css"; // Import StudentList styles
import Navbar from "../../components/Navbar";

const UploadedFilesPage = () => {
  const { department, className } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // or fetch from user object
    setRole(storedRole);
  }, []);


  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await getUploadedFilesByDeptAndClass(department, className);
        setStudents(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch uploaded files:", error);
        setLoading(false);
      }
    };

    if (department && className) fetchFiles();
  }, [department, className]);

  const handleViewDocument = (fileUrl) => {
    if (fileUrl) {
      const fullFileUrl = `http://localhost:5000${fileUrl}`;
      window.open(fullFileUrl, "_blank");
    } else {
      console.error("No file URL provided.");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
       <Navbar onLogout={() => navigate("/login")} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>
      <button
          onClick={() => {
            if (role === "admin") {
              navigate("/admin-dashboard");
            } else if (role === "placementofficer") {
              navigate("/placement-dashboard");
            } else if(role === "placementcoordinator"){
              navigate("/coordinator-dashboard")
            }else {
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
        <div className="header-controls">
          <h2>Uploaded Files - {department} / {className}</h2>
        </div>

        <div className="table-wrapper">
          <table className="student-table2">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Email</th>
                <th>Register No</th>
                <th>Document</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan="4">No students or files found.</td>
                </tr>
              ) : (
                students.map((upload, index) => {
                  const student = upload.student;
                  return (
                    <tr key={index}>
                      <td>{student.user?.username}</td>
                      <td>{student.user?.email}</td>
                      <td>{student.registerNumber || "N/A"}</td>
                      <td>
                        {upload.fileUrl ? (
                          <button className="edit-btn" onClick={() => handleViewDocument(upload.fileUrl)}>
                               View Document
                          </button>
                        ) : (
                          <span>No document uploaded</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UploadedFilesPage;
