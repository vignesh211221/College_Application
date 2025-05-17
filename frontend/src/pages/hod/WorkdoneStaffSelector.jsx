import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStaffByDepartment } from "../../services/staffApi";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";

const WorkdoneStaffSelector = () => {
  const { department } = useParams();
  const [staffs, setStaffs] = useState([]);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const res = await getStaffByDepartment(department);
        setStaffs(res.data);
      } catch (err) {
        toast.error("Failed to load staff");
      }
    };

    fetchStaffs();
  }, [department]);

  const handleStaffClick = (staffId) => {
    navigate(`/workdone/stafflist/${staffId}`);
  };

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>

      {role === "admin" && (
        <button
          onClick={() => navigate("/admin-dashboard")}
          className="dash-btn"
        >
          Back to Dashboard
        </button>
      )}
      <br></br>
      <br></br>

      <div style={{ padding: "20px" }}>
        <h2>Select Staff to View Workdone - {department} Dept</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          {staffs.length > 0 ? (
            staffs.map((staff) => (
              <div
                key={staff._id}
                tabIndex={0}
                role="button"
                onClick={() => handleStaffClick(staff._id)}
                onKeyDown={(e) =>
                  (e.key === "Enter" || e.key === " ") &&
                  handleStaffClick(staff._id)
                }
                style={{
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  padding: "15px",
                  borderRadius: "10px",
                  background: "#f0f0f0",
                  width: "200px",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <h3>{staff.user?.username}</h3>
                <p>{staff.email}</p>
              </div>
            ))
          ) : (
            <p>No staff found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkdoneStaffSelector;
