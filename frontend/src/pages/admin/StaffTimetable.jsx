import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStaffById } from "../../services/staffApi";
import {
  createTimetable,
  deleteTimetable,
  getTimetableByStaffId,
  updateTimetableByStaffAndDay,
} from "../../services/timetableApi";
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

const CreateTimetable = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [staffName, setStaffName] = useState("");
  const [timetableData, setTimetableData] = useState(getInitialTimetableData());
  const [existingDays, setExistingDays] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

  useEffect(() => {
    const fetchStaffName = async () => {
      try {
        const res = await getStaffById(staffId);
        setStaffName(res.data.user.username);
      } catch (err) {
        toast.error("Failed to fetch staff info");
      }
    };
    fetchStaffName();
  }, [staffId]);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await getTimetableByStaffId(staffId);
        const data = getInitialTimetableData();
        const daysWithData = [];

        res.data.forEach((entry) => {
          if (entry.day && entry.periods) {
            data[entry.day] = entry.periods;
            daysWithData.push(entry.day);
          }
        });

        setTimetableData(data);
        setExistingDays(daysWithData);
        setIsEditable(false);
      } catch (err) {
        setTimetableData(getInitialTimetableData());
        setExistingDays([]);
        setIsEditable(true);
        toast.info("No existing timetable found. You can now create one.");
      }
    };

    fetchTimetable();
  }, [staffId]);

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
          staff: staffId,
          day,
          periods: timetableData[day],
        };

        if (existingDays.includes(day)) {
          await updateTimetableByStaffAndDay(staffId, day, payload);
        } else {
          await createTimetable(payload);
        }
      }
      toast.success("Timetable saved successfully!");
      setIsEditable(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save timetable");
    }
  };

  const handleDelete = async () => {
    try {
      for (const day of days) {
        await deleteTimetable(staffId, day);
      }
      toast.success("Timetable deleted successfully!");
      setTimetableData(getInitialTimetableData());
      setExistingDays([]);
      setIsEditable(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete timetable");
    }
  };

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button><br></br><br></br>

      <div className="create-timetable-container2">
        <h2>
          Create Timetable for: <span className="highlight">{staffName}</span>
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
                          placeholder="Class"
                          value={period.class}
                          onChange={(e) => handleChange(day, index, "class", e.target.value)}
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
            <button className="edit-btn2" onClick={() => setIsEditable(true)}>
              Edit Timetable
            </button>
            <button className="delete-btn2" onClick={handleDelete}>
              Delete Timetable
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateTimetable;
