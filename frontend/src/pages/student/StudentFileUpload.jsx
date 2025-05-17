import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadStudentFile } from "../../services/studentApi";
import "./StudentFileUpload.css"; // 👈 Import external CSS
import Navbar from "../../components/Navbar";

const StudentFileUpload = () => {
  const { studentId } = useParams();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return setStatus("❗ Please select a file");

    try {
      await uploadStudentFile(studentId, file);
      setStatus("✅ File uploaded successfully!");
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed.");
    }
  };

  return (
    <div>
      <Navbar  onLogout={() => navigate("/login")} />
        <br></br>
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>
      <br></br>
      <br></br>
    <div className="upload-container">
      <h2>Upload OfferLetter or Internship Certificates</h2>
      <form className="upload-form" onSubmit={handleUpload}>
        <input type="file" onChange={handleChange} />
        <button type="submit">Upload</button>
      </form>
      {status && <p className="upload-status">{status}</p>}
    </div>
    </div>
  );
};

export default StudentFileUpload;
