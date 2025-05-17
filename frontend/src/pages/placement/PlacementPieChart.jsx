import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate, useParams } from "react-router-dom";
import { getAppliedStudentsByDepartment } from "../../services/placementApi";
import { getStudents } from "../../services/studentApi";
import Navbar from "../../components/Navbar";
import "../admin/StudentList.css";

const COLORS = [
  "red", "darkblue", "#ffc658", "#ff8042", "#8dd1e1",
  "#a4de6c", "#d0ed57", "#ffc0cb", "#ffa07a", "#b0e0e6"
];

const PlacementPieChart = () => {
  const { placementId } = useParams();
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const fetchDepartments = async () => {
    try {
      const allStudents = await getStudents();
      const departmentsSet = new Set();

      allStudents.data.forEach(student => {
        if (student.department) {
          departmentsSet.add(student.department);
        }
      });

      const departments = Array.from(departmentsSet);
      const pieData = [];

      for (let dept of departments) {
        try {
          const students = await getAppliedStudentsByDepartment(placementId, dept);
          if (students.length > 0) {
            pieData.push({ name: dept, value: students.length });
          }
        } catch (error) {
          // Ignore departments without applied students
        }
      }

      setData(pieData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [placementId]);

  const handleClick = (data, index) => {
    const department = data.name;
    navigate(`/applied-list/${placementId}/${department}`);
  };

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      {/* <div style={{ padding: "10px", textAlign: "center" }}> */}
      <br></br>
       <div className="button-container">
  <button onClick={() => navigate(-1)} className="back-btn">
    Back
  </button>
  <button
    onClick={() => {
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "placementofficer") {
        navigate("/placement-dashboard");
      } else {
        toast.error("Unauthorized role");
      }
    }}
    className="dash-btn"
  >
    Back to Dashboard
  </button>
</div>

        <h2 style={{ margin: "20px 0", fontWeight: "bold" }}>Applied Students by Department</h2>

      {data.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "50px" }}>No applied students found.</p>
      ) : (
        <div style={{
          width: "100%",
          maxWidth: "600px",
          height: "400px",
          margin: "0 auto",
          padding: "0 10px"
        }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius="80%"
                fill="#8884d8"
                dataKey="value"
                onClick={handleClick}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cursor="pointer" />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default PlacementPieChart;
