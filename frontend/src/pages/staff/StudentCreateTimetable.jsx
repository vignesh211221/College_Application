import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStudentTimetableByStudentId, createOrUpdateStudentTimetable, deleteStudentTimetable } from "../../services/studentTimetableApi";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import "./CreateStudentTimetable.css";

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
      staff: "",
    }));
  });
  return initialData;
};

const CreateStudentTimetable = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [timetableData, setTimetableData] = useState(getInitialTimetableData());
  const [existingDays, setExistingDays] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    // Fetch student info
    const fetchStudentInfo = async () => {
      try {
        // Assuming there's an API to get student info
        const res = await getStudentTimetableByStudentId(studentId);
        setStudentName(res.data.username); // Adjust based on response structure
        setTimetableData(getInitialTimetableData());
      } catch (err) {
        toast.error("Failed to fetch student timetable.");
      }
    };
    fetchStudentInfo();
  }, [studentId]);

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
          student: studentId,
          day,
          periods: timetableData[day],
        };

        // Either create a new timetable or update it based on existing days
        await createOrUpdateStudentTimetable(payload);
      }
      toast.success("Timetable saved successfully!");
      setIsEditable(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save timetable.");
    }
  };

  const handleDelete = async () => {
    try {
      for (const day of days) {
        await deleteStudentTimetable(studentId, day);
      }
      toast.success("Timetable deleted successfully!");
      setTimetableData(getInitialTimetableData());
      setExistingDays([]);
      setIsEditable(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete timetable.");
    }
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
      <div className="create-student-timetable-container">
        <h2>
          Create Timetable for: <span className="highlight">{studentName}</span>
        </h2>
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
                          type="text"
                          placeholder="Staff"
                          value={period.staff}
                          onChange={(e) => handleChange(day, index, "staff", e.target.value)}
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
          <div className="edit-delete-btns">
            <button className="edit-btn" onClick={() => setIsEditable(true)}>
              Edit Timetable
            </button>
            <button className="delete-btn" onClick={handleDelete}>
              Delete Timetable
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStudentTimetable;
