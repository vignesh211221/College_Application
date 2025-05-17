import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createTimetable, getTimetableByClass } from "../../services/studentTimetable";
import {
  getStaffDetailsByClass,
  createOrUpdateStaffDetail,
  updateStaffDetailById,
  deleteStaffDetailById,
} from "../../services/staffDetailApi";
import { toast } from "react-toastify";
import "../hod/CreateTimetable.css";
import Navbar from "../../components/Navbar";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periodsPerDay = 8;

const getInitialTimetableData = () => {
  const initialData = {};
  days.forEach((day) => {
    initialData[day] = Array.from({ length: periodsPerDay }, (_, i) => ({
      periodNumber: i + 1,
      subject: "",
      time: "",
      endTime: "",
      class: "",
    }));
  });
  return initialData;
};

const CreateStudentTimetable = () => {
  const { className, department } = useParams();
  const navigate = useNavigate();

  const [timetableData, setTimetableData] = useState(getInitialTimetableData());
  const [isEditable, setIsEditable] = useState(false);
  const [staffDetails, setStaffDetails] = useState([]);
  const [newStaffDetail, setNewStaffDetail] = useState({
    StaffName: "",
    SubjectCode: "",
    Subject: "",
    Credits: "",
    className,
    PeriodsHours: "",
  });
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);  // Popup visibility state
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Delete confirmation state
  const [staffToDelete, setStaffToDelete] = useState(null); // Staff ID to delete

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTimetableByClass(className, department);
        const data = getInitialTimetableData();
        res.timetables.forEach((entry) => {
          if (entry.day && entry.periods) {
            data[entry.day] = entry.periods;
          }
        });
        setTimetableData(data);
        setIsEditable(false);
      } catch (err) {
        setTimetableData(getInitialTimetableData());
        setIsEditable(true);
        toast.info("No existing timetable found. You can now create one.");
      }

      try {
        const staffRes = await getStaffDetailsByClass(className);
        setStaffDetails(staffRes.staffDetails || []);
      } catch (err) {
        console.error("Failed to fetch staff details", err);
        setStaffDetails([]);
      }
    };

    fetchData();
  }, [className, department]);

  const handleChange = (day, index, field, value) => {
    setTimetableData((prev) => ({
      ...prev,
      [day]: prev[day].map((period, i) =>
        i === index ? { ...period, [field]: value } : period
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      for (const day of days) {
        const payload = {
          className,
          department,
          day,
          periods: timetableData[day],
        };
        await createTimetable(payload);
      }
      toast.success("Timetable saved successfully!");
      setIsEditable(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save timetable");
    }
  };

  const handleStaffChange = (e) => {
    const { name, value } = e.target;
    setNewStaffDetail((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdateStaff = async () => {
    try {
      if (editingStaffId) {
        await updateStaffDetailById(editingStaffId, newStaffDetail);
        toast.success("Staff detail updated!");
        setEditingStaffId(null);
      } else {
        await createOrUpdateStaffDetail(newStaffDetail);
        toast.success("Staff detail added!");
      }

      setNewStaffDetail({
        StaffName: "",
        SubjectCode: "",
        Subject: "",
        Credits: "",
        className,
        PeriodsHours: "",
      });

      const updatedStaff = await getStaffDetailsByClass(className);
      setStaffDetails(updatedStaff.staffDetails || []);
      setShowPopup(false); // Close the popup after submit
    } catch (err) {
      toast.error("Failed to save staff detail");
    }
  };

  const handleEditStaff = (staff) => {
    setNewStaffDetail(staff);
    setEditingStaffId(staff._id);
    setShowPopup(true); // Open popup to edit staff
  };

  const handleDeleteClick = (id) => {
    setStaffToDelete(id);
    setShowDeleteConfirmation(true);  // Show confirmation popup
  };

  const handleDeleteStaff = async () => {
    try {
      // Delete the staff record by its ID
      await deleteStaffDetailById(staffToDelete);
  
      // Immediately update the state to reflect the deletion
      const updatedStaff = staffDetails.filter(staff => staff._id !== staffToDelete);
      setStaffDetails(updatedStaff); // Update the list without refresh
  
      toast.success("Staff detail deleted successfully!");
      setShowDeleteConfirmation(false);  // Close the confirmation popup
    } catch (err) {
      toast.error("Failed to delete staff detail");
      setShowDeleteConfirmation(false);  // Close the confirmation popup
    }
  };
  

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);  // Close the confirmation popup without deleting
  };

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>
      <br></br>
      <br></br>
      <div className="create-timetable-container">
        <h2>Create Timetable for: {className} - {department}</h2>
        <div className="table-wrapper">
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Day / Period</th>
                {[...Array(periodsPerDay)].map((_, i) => (
                  <th key={i}>Period {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td><strong>{day}</strong></td>
                  {timetableData[day]?.map((period, index) => (
                    <td key={index}>
                      <div className="period-cell">
                        <input
                          type="text"
                          placeholder="Subject"
                          value={period.subject}
                          onChange={(e) => handleChange(day, index, "subject", e.target.value)}
                          disabled={!isEditable}
                        />
                        <input
                          type="time"
                          value={period.time}
                          onChange={(e) => handleChange(day, index, "time", e.target.value)}
                          disabled={!isEditable}
                        />
                        <input
                          type="time"
                          value={period.endTime}
                          onChange={(e) => handleChange(day, index, "endTime", e.target.value)}
                          disabled={!isEditable}
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isEditable ? (
          <div className="submit-btn-wrapper">
            <button className="submit-btn" onClick={handleSubmit}>
              Save Timetable
            </button>
          </div>
        ) : (
          <div className="submit-btn-wrapper">
            <button className="submit-btn2" onClick={() => setIsEditable(true)}>
              Edit Timetable
            </button>
          </div>
        )}

        <div className="staff-section">
          <h3>Staff Details</h3>
          <button onClick={() => setShowPopup(true)} className="back-btn">
            Add Staff
          </button>
          <br />
          <br />
          <div className="table-wrapper">
          <table className="staff-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Subject</th>
                <th>Credits</th>
                <th>Hours</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffDetails.map((staff) => (
                <tr key={staff._id}>
                  <td>{staff.StaffName}</td>
                  <td>{staff.SubjectCode}</td>
                  <td>{staff.Subject}</td>
                  <td>{staff.Credits}</td>
                  <td>{staff.PeriodsHours}</td>
                  <td>
                    <div className="action-buttons">
                    <button className="edit-btn" onClick={() => handleEditStaff(staff)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteClick(staff._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        {showPopup && (
          <div className="modal-overlay">
            <div className="content">
              <h3>{editingStaffId ? "Edit Staff" : "Add Staff"}</h3>
              <input
                type="text"
                name="StaffName"
                placeholder="Staff Name"
                value={newStaffDetail.StaffName}
                onChange={handleStaffChange}
              />
              <input
                type="text"
                name="SubjectCode"
                placeholder="Subject Code"
                value={newStaffDetail.SubjectCode}
                onChange={handleStaffChange}
              />
              <input
                type="text"
                name="Subject"
                placeholder="Subject"
                value={newStaffDetail.Subject}
                onChange={handleStaffChange}
              />
              <input
                type="number"
                name="Credits"
                placeholder="Credits"
                value={newStaffDetail.Credits}
                onChange={handleStaffChange}
              />
              <input
                type="number"
                name="PeriodsHours"
                placeholder="Hours/Week"
                value={newStaffDetail.PeriodsHours}
                onChange={handleStaffChange}
              />

              <div className="form-actions">
                <button onClick={handleAddOrUpdateStaff}>
                  {editingStaffId ? "Update" : "Add"} Staff
                </button>
                <button onClick={() => setShowPopup(false)}>Close</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Popup */}
        {showDeleteConfirmation && (
          <div className="modal-overlay">
            <div className="content">
              <h3>Are you sure you want to delete this staff detail?</h3>
              <div className="form-actions">
                <button onClick={handleDeleteStaff}>Yes</button>
                <button onClick={handleCancelDelete}>No</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStudentTimetable;
