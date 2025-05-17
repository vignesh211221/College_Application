import React, { useState, useEffect } from 'react';
import { getPeriodsByStaffAndDay } from '../../services/timetableApi';
import { createWorkDone, getWorkDoneByStaffAndDate } from '../../services/workdoneApi';
import './StaffWorkDonePage.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const StaffWorkDonePage = () => {
  const staffId = localStorage.getItem("staffId");
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedDay, setSelectedDay] = useState(getDayName(new Date()));
  const [periods, setPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [formData, setFormData] = useState({
    unit: '',
    syllabus: '',
    coveredTopic: '',
    completedTime: ''
  });
  const [submittedPeriods, setSubmittedPeriods] = useState(new Set());

  function getDayName(date) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[new Date(date).getDay()];
  }

  useEffect(() => {
    const fetchData = async () => {
      if (staffId && selectedDate) {
        try {
          // Fetching periods for the selected day
          const res = await getPeriodsByStaffAndDay(staffId, selectedDay);
          const filtered = (res.periods || []).filter(p => p.subject && p.class);
          setPeriods(filtered);

          // Fetching work done for the selected date
          const workRes = await getWorkDoneByStaffAndDate(staffId, selectedDate);
          const submitted = new Set((workRes || []).map(w => w.periodNumber));
          setSubmittedPeriods(submitted);
        } catch (err) {
          console.error("Error fetching periods or submitted work", err);
        }
      }
    };

    fetchData();
  }, [staffId, selectedDate, selectedDay]);  // Dependency on selectedDate and selectedDay

  const handleOpenForm = (period) => {
    // Ensure you only allow the form to open for unsaved periods
    if (submittedPeriods.has(period.periodNumber)) {
      alert("Work for this period has already been submitted!");
      return; // Don't allow opening the form for already submitted periods
    }
    
    setSelectedPeriod(period);
    setFormData({
      unit: '',
      syllabus: '',
      coveredTopic: '',
      completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = {
        staff: staffId,
        day: selectedDay,
        periodNumber: selectedPeriod.periodNumber,
        subject: selectedPeriod.subject,
        class: selectedPeriod.class,
        timetableRef: selectedPeriod.timetableRef,
        ...formData
      };

      await createWorkDone(data);
      alert("Work submitted successfully!");
      setSubmittedPeriods(prev => new Set(prev).add(selectedPeriod.periodNumber));
      setSelectedPeriod(null);
    } catch (err) {
      console.error("Error submitting work", err);
    }
  };

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">Back</button>
      <br></br>
      <br></br>
      <div className="workdone-container">
        <h2 className="title">Work Done Entry</h2>

        <div className="date-selector">
          <p>Current Date: <strong>{selectedDate}</strong></p>
        </div>
        <div>
          <p>Showing periods for: <strong>{selectedDay}</strong></p>
        </div>

        {periods.length === 0 ? (
          <p className="no-periods">No assigned periods for {selectedDay}.</p>
        ) : (
          <div className="period-grid">
            {periods.map((period, index) => (
              <div
                key={index}
                onClick={() => handleOpenForm(period)}
                className={`period-card ${submittedPeriods.has(period.periodNumber) ? 'submitted' : ''}`}
              >
                <p><strong>Period {period.periodNumber}</strong></p>
                <p>Class: {period.class}</p>
                <p>Subject: {period.subject}</p>
              </div>
            ))}
          </div>
        )}

        {selectedPeriod && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Submit Work Done</h3>
              <p>Period: {selectedPeriod.periodNumber} | Subject: {selectedPeriod.subject}</p>

              <input
                type="text"
                name="unit"
                placeholder="Unit"
                value={formData.unit}
                onChange={handleChange}
              />
              <input
                type="text"
                name="syllabus"
                placeholder="Syllabus"
                value={formData.syllabus}
                onChange={handleChange}
              />
              <input
                type="text"
                name="coveredTopic"
                placeholder="Covered Topic"
                value={formData.coveredTopic}
                onChange={handleChange}
              />
              <input
                type="text"
                name="completedTime"
                placeholder="Completed Time (e.g., 09:50)"
                value={formData.completedTime}
                onChange={handleChange}
              />

              <div className="modal-actions">
                <button onClick={() => setSelectedPeriod(null)} className="btn cancel">Cancel</button>
                <button onClick={handleSubmit} className="btn submit">Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffWorkDonePage;
