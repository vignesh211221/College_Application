// StudentTimetableView.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTimetableByClass } from "../../services/studentTimetable";
import { getStaffDetailsByClass } from "../../services/staffDetailApi";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
    }));
  });
  return initialData;
};

const convertTo12HourFormat = (time24) => {
  if (!time24) return "";
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${ampm}`;
};

const StudentTimetableView = () => {
  const { className, department } = useParams();
  const navigate = useNavigate();
  const [timetableData, setTimetableData] = useState(getInitialTimetableData());
  const [staffDetails, setStaffDetails] = useState([]);

  const [role, setRole] = useState("");

    useEffect(() => {
      const storedRole = localStorage.getItem("role"); // or fetch from user object
      setRole(storedRole);
    }, []);


  useEffect(() => {
    const fetchTimetableAndStaff = async () => {
      try {
        const timetableRes = await getTimetableByClass(className, department);
        const data = getInitialTimetableData();

        timetableRes.timetables.forEach((entry) => {
          if (entry.day && entry.periods) {
            data[entry.day] = entry.periods;
          }
        });
        setTimetableData(data);

        const staffRes = await getStaffDetailsByClass(className);
        if (staffRes.success) {
          setStaffDetails(staffRes.staffDetails);
        } else {
          toast.error("No staff details available");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch timetable or staff details");
      }
    };

    fetchTimetableAndStaff();
  }, [className, department]);

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text(`Timetable for ${className} - ${department}`, 40, 40);
  
    const tableColumns = ["Day / Period", ...Array.from({ length: periodsPerDay }, (_, i) => `Period ${i + 1}`)];
    const tableBody = days.map((day) => {
      const row = [day];
      timetableData[day]?.forEach((period) => {
        const hasData = period.subject || period.time || period.endTime;
        const text = hasData
          ? `${period.subject || ""}\n${convertTo12HourFormat(period.time)} - ${convertTo12HourFormat(period.endTime)}`
          : "-";
        row.push(text);
      });
      return row;
    });
  
    // Draw timetable and capture the height used
    const tableOptions = {
      head: [tableColumns],
      body: tableBody,
      startY: 60,
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 6, halign: "left", valign: "middle", overflow: "linebreak" },
      headStyles: { fillColor: [24, 90, 223], textColor: [255, 255, 255], fontStyle: "bold" },
      columnStyles: { 0: { cellWidth: 70 } },
      didDrawPage: function (data) {
        const finalY = data.cursor.y + 20;
  
        if (staffDetails.length > 0) {
          doc.setFontSize(16);
          doc.text("Staff Details", 40, finalY);
  
          const staffTableColumns = ["Name", "Subject", "Subject Code", "Credits", "Hours/Weekly"];
          const staffTableBody = staffDetails.map((staff) => [
            staff.StaffName || "-",
            staff.Subject || "-",
            staff.SubjectCode || "-",
            staff.Credits || "-",
            staff.PeriodsHours || "-",
          ]);
  
          autoTable(doc, {
            head: [staffTableColumns],
            body: staffTableBody,
            startY: finalY + 10,
            theme: "grid",
            styles: { fontSize: 10, cellPadding: 6 },
            headStyles: { fillColor: [24, 90, 223], textColor: [255, 255, 255], fontStyle: "bold" },
          });
        }
      },
    };
  
    autoTable(doc, tableOptions);
    doc.save(`${className}_${department}_Timetable.pdf`);
  };
  

  const printTimetable = () => {
    const printWindow = window.open("", "_blank");
    const printableHTML = `
      <html>
        <head>
          <title>Timetable</title>
          <style>
            @page { size: landscape; }
            body { font-family: Arial, sans-serif; }
            .table-wrapper, .staff-table-wrapper { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; vertical-align: top; }
            th { background-color: #185adf; color: #fff; }
            .period-cell p { margin: 2px 0; font-size: 12px; }
            h2, h3 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>Timetable for ${className} - ${department}</h2>
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Day / Period</th>
                  ${Array.from({ length: periodsPerDay }, (_, i) => `<th>Period ${i + 1}</th>`).join("")}
                </tr>
              </thead>
              <tbody>
                ${days
                  .map(
                    (day) => `
                  <tr>
                    <td><strong>${day}</strong></td>
                    ${timetableData[day]
                      .map(
                        (period) => `
                        <td>
                          <div class="period-cell">
                            ${period.subject ? `<p><strong>${period.subject}</strong></p>` : "<p>-</p>"}
                            ${period.time && period.endTime ? `<p>${convertTo12HourFormat(period.time)} - ${convertTo12HourFormat(period.endTime)}</p>` : "<p>-</p>"}
                          </div>
                        </td>`
                      )
                      .join("")}
                  </tr>`
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <div class="staff-table-wrapper">
            <h3>Staff Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Subject Code</th>
                  <th>Credits</th>
                  <th>Hours/Weekly</th>
                </tr>
              </thead>
              <tbody>
                ${
                  staffDetails.length > 0
                    ? staffDetails
                        .map(
                          (staff) => `
                    <tr>
                      <td>${staff.StaffName || "-"}</td>
                      <td>${staff.Subject || "-"}</td>
                      <td>${staff.SubjectCode || "-"}</td>
                      <td>${staff.Credits || "-"}</td>
                      <td>${staff.PeriodsHours || "-"}</td>
                    </tr>`
                        )
                        .join("")
                    : '<tr><td colspan="5">No staff details available.</td></tr>'
                }
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(printableHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">Back</button>
      <button
        onClick={() => {
          if (role === "admin") {
            navigate("/admin-dashboard");
          } else if (role === "student") {
            navigate("/student-dashboard");
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


      <h2>Timetable for: {className} - {department}</h2>
      <div className="submit-btn-wrapper">
        <button className="edit-btn2" onClick={downloadPDF}>Download Timetable (PDF)</button>
        <button className="delete-btn2" onClick={printTimetable}>Print Timetable</button>
      </div>

      <div className="view-timetable-container">
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
                        {period.subject ? <p><strong>{period.subject}</strong></p> : <p>-</p>}
                        {(period.time && period.endTime) ? (
                          <p>{convertTo12HourFormat(period.time)} - {convertTo12HourFormat(period.endTime)}</p>
                        ) : <p>-</p>}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="staff-table-wrapper">
          <h3>Staff Details</h3>
          <table className="timetable-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Subject Code</th>
                <th>Credits</th>
                <th>Hours/Weekly</th>
              </tr>
            </thead>
            <tbody>
              {staffDetails.length > 0 ? (
                staffDetails.map((staff, index) => (
                  <tr key={index}>
                    <td>{staff.StaffName || "-"}</td>
                    <td>{staff.Subject || "-"}</td>
                    <td>{staff.SubjectCode || "-"}</td>
                    <td>{staff.Credits || "-"}</td>
                    <td>{staff.PeriodsHours || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No staff details available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTimetableView;
