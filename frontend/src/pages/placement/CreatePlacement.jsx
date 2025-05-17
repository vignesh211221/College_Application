import React, { useEffect, useState } from "react";
import {
  createPlacement,
  getAllPlacements,
  updatePlacement,
  deletePlacement,
} from "../../services/placementApi";
import { getStudentFilters } from "../../services/studentApi";
import "../admin/StudentList.css"; // Reusing student modal and button styles
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

const CreatePlacement = () => {
  const navigate = useNavigate();
  const [placements, setPlacements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    companyName: "",
    jobRole: "",
    description: "",
    skillsRequired: "",
    eligibility: "",
    ctc: "",
    applyLink: "",
    location: "",
    departments: [],
    classNames: [],
    regulations: [],
    expiryDate: "",
  });
  const [filters, setFilters] = useState({ departments: [], regulations: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlacements();
    fetchFilters();
  }, []);

  const fetchPlacements = async () => {
    try {
      const data = await getAllPlacements();
      setPlacements(data);
    } catch (error) {
      setError("Failed to fetch placements.");
    }
  };

  const fetchFilters = async () => {
    try {
      const { data } = await getStudentFilters();
      setFilters(data);
    } catch (error) {
      setError("Failed to fetch student filters.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "skillsRequired" ? value.split(",") : value,
    }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, selectedOptions } = e.target;
    const values = Array.from(selectedOptions, (opt) => opt.value);
    setFormData((prev) => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skillsRequired: Array.isArray(formData.skillsRequired)
        ? formData.skillsRequired
        : formData.skillsRequired.split(","),
    };

    try {
      if (editingId) {
        await updatePlacement(editingId, payload);
      } else {
        await createPlacement(payload);
      }
      fetchPlacements();
      resetForm();
    } catch (error) {
      setError("Failed to save placement.");
    }
  };

  const handleEdit = (placement) => {
    setShowForm(true);
    setFormData({
      ...placement,
      skillsRequired: placement.skillsRequired.join(", "), // Convert skills to a comma-separated string
      expiryDate: new Date(placement.expiryDate).toISOString().split("T")[0],
    });
    setEditingId(placement._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this placement?")) {
      try {
        await deletePlacement(id);
        fetchPlacements();
      } catch (error) {
        setError("Failed to delete placement.");
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      type: "",
      companyName: "",
      jobRole: "",
      description: "",
      skillsRequired: "",
      eligibility: "",
      ctc:"",
      applyLink: "",
      location: "",
      departments: [],
      classNames: [],
      regulations: [],
      expiryDate: "",
    });
    setShowForm(false);
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
    <div className="student-list-container">
      <div className="header-controls">
        <h2>Placements</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          Add Placement
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="content">
            <form className="student-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="type"
                  placeholder="Type (job/internship)"
                  value={formData.type}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company Name"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="jobRole"
                  placeholder="Job Role"
                  value={formData.jobRole}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="skillsRequired"
                  placeholder="Skills (comma-separated)"
                  value={formData.skillsRequired}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="eligibility"
                  placeholder="Eligibility"
                  value={formData.eligibility}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="ctc"
                  placeholder="CTC"
                  value={formData.ctc}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="applyLink"
                  placeholder="Apply Link"
                  value={formData.applyLink}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <select
                  name="departments"
                  multiple
                  onChange={handleMultiSelectChange}
                  value={formData.departments}
                >
                  {filters.departments.map((dep) => (
                    <option key={dep} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <select
                  name="regulations"
                  multiple
                  onChange={handleMultiSelectChange}
                  value={formData.regulations}
                >
                  {filters.regulations.map((reg) => (
                    <option key={reg} value={reg}>
                      {reg}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="submit">
                  {editingId ? "Update" : "Submit"}
                </button>
                <button type="button" onClick={resetForm}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {error && <div className="error">{error}</div>} {/* Error message */}

      <div className="table-wrapper">
        <table className="student-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Company</th>
              <th>Role</th>
              <th>Description</th>
              <th>Skills Required</th>
              <th>Eligibility</th>
              <th>CTC</th>
              <th>ApplyLink</th>
              <th>location</th>
              <th>Departments</th>
              <th>Regulations</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {placements.map((p) => (
              <tr key={p._id}>
                <td>{p.type}</td>
                <td>{p.companyName}</td>
                <td>{p.jobRole}</td>
                <td>{p.description}</td>
                <td>{p.skillsRequired}</td>
                <td>{p.eligibility}</td>
                <td>{p.ctc}</td>
                <td>{p.applyLink}</td>
                <td>{p.location}</td>
                <td>{p.departments.join(", ")}</td>
                <td>{p.regulations.join(", ")}</td>
                <td>{new Date(p.expiryDate).toLocaleDateString()}</td>
                <td>
                  
                  <div className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(p)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(p._id)}>
                    Delete
                  </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
};

export default CreatePlacement;
