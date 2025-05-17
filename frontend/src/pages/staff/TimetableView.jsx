import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTimetableByStaffId } from "../../services/timetableApi";
import Navbar from "../../components/Navbar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../hod/CreateTimetable.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periodsPerDay = 8;

const convertTo12HourFormat = (time) => {
  if (!time) return "";
  const [hour, minute] = time.split(":");
  const hours = parseInt(hour, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  const newHour = hours % 12 || 12;
  return `${newHour}:${minute} ${ampm}`;
};

const ViewTimetable = () => {
  const { staffId } = useParams();
  const navigate = useNavigate();
  const [timetableData, setTimetableData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await getTimetableByStaffId(staffId);
        const structuredData = {};
        days.forEach((day) => {
          structuredData[day] = Array.from({ length: periodsPerDay }, (_, i) => ({
            periodNumber: i + 1,
            subject: "",
            time: "",
            endTime: "",
            class: "",
          }));
        });

        res.data.forEach((entry) => {
          if (entry.day && entry.periods && structuredData[entry.day]) {
            structuredData[entry.day] = entry.periods;
          }
        });

        setTimetableData(structuredData);
      } catch (err) {
        console.error("Error fetching timetable", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, [staffId]);

  const downloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(18);
    doc.text("Staff Timetable", 40, 40);

    const tableColumns = ["Day / Period", ...Array.from({ length: periodsPerDay }, (_, i) => `Period ${i + 1}`)];
    const tableBody = days.map((day) => {
      const row = [day];
      timetableData[day]?.forEach((period) => {
        const hasData = period.subject || period.class || period.time || period.endTime;
        const text = hasData
          ? `${period.subject || ""}\n${period.class || ""}\n${convertTo12HourFormat(period.time)} - ${convertTo12HourFormat(period.endTime)}`
          : "";
        row.push(text);
      });
      return row;
    });

    autoTable(doc, {
      head: [tableColumns],
      body: tableBody,
      startY: 60,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 6,
        halign: "left",
        valign: "middle",
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [24, 90, 223],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        0: { cellWidth: 70 },
      },
    });

    doc.save("Timetable.pdf");
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
            .table-wrapper { margin-top: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; vertical-align: top; }
            th { background-color: #185adf; color: #fff; }
            .period-cell p { margin: 2px 0; font-size: 12px; }
            h2 { text-align: center; }
          </style>
        </head>
        <body>
          <h2>Staff Timetable</h2>
          ${document.querySelector(".table-wrapper")?.outerHTML || ""}
        </body>
      </html>
    `;
    printWindow.document.write(printableHTML);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading timetable...</p>;

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">Back</button>
      <br></br>
      <br></br>

      <div className="create-timetable-container2">
        <h2>View Timetable</h2>

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
                  {timetableData[day]?.map((period, index) => {
                    const hasData = period.subject || period.class || period.time || period.endTime;
                    return (
                      <td key={index}>
                        <div className="period-cell">
                          {hasData && (
                            <>
                              {period.subject && <p><strong>Subject:</strong> {period.subject}</p>}
                              {period.class && <p><strong>Class:</strong> {period.class}</p>}
                              {(period.time && period.endTime) && (
                                <p><strong>Time:</strong> {convertTo12HourFormat(period.time)} - {convertTo12HourFormat(period.endTime)}</p>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="submit-btn-wrapper">
          <button className="edit-btn2" onClick={downloadPDF}>Download Timetable (PDF)</button>
          <button className="delete-btn2" onClick={printTimetable}>Print Timetable</button>
        </div>
      </div>
    </div>
  );
};

export default ViewTimetable;
