import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getAppliedStudentsByDepartment, updateSelectionStatus } from '../../services/placementApi';
import Navbar from '../../components/Navbar';
import '../admin/StudentList.css'; // Import the CSS file

const AppliedStudentList = () => {
  const navigate = useNavigate();
  const { placementId, department } = useParams();
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true); // New loading state
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true); // Set loading true when data is being fetched
      try {
        const data = await getAppliedStudentsByDepartment(placementId, department);
        setStudents(data);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false); // Set loading false when data fetching is done
      }
    };
    fetchStudents();
  }, [placementId, department]);

  const handleSelectToggle = async (studentId, currentStatus) => {
    const newStatus = currentStatus === 'selected' ? 'unselected' : 'selected';
    try {
      await updateSelectionStatus(studentId, newStatus,placementId);
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, selectionStatus: newStatus } : s
        )
      );
    } catch (err) {
      console.error('Failed to update selection status', err);
    }
  };

  const filteredStudents = students.filter((student) => {
    const name = student.user?.username?.toLowerCase() || '';
    const reg = student.registerNumber?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    const matchSearch = name.includes(search) || reg.includes(search);
    const matchStatus =
      filterStatus === 'all' || student.selectionStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <Navbar onLogout={() => navigate('/login')} />
      <br />
      <button onClick={() => navigate(-1)} className="back-btn">
        Back
      </button>
      <br />
      <br />

      <div className="student-list-container">
        <h2 className="header">Applied Students - {department}</h2>

        <div className="filter-controls">
          <input
            type="text"
            placeholder="Search by Name or Register Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All</option>
            <option value="selected">Selected</option>
            <option value="unselected">Unselected</option>
          </select>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <p className="loading">Loading students...</p>
          ) : filteredStudents.length === 0 ? (
            <p className="no-data">
              No students found in {department} matching the criteria.
            </p>
          ) : (
            <table className="student-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Register Number</th>
                  <th>Phone Number</th>
                  <th>Regulation</th>
                  <th>Semester</th>
                  <th>CGPA</th>
                  <th>10th Mark</th>
                  <th>12th Mark</th>
                  <th>Class Name</th>
                  <th>Department</th>
                  <th>Status</th>
                  {userRole === 'placementofficer' && <th>Action</th>}

                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.user?.username}</td>
                    <td>{student.user?.email}</td>
                    <td>{student.registerNumber}</td>
                    <td>{student.phoneNumber}</td>
                    <td>{student.regulation}</td>
                    <td>{student.semester}</td>
                    <td>{student.cgpa}</td>
                    <td>{student.tenthMark}</td>
                    <td>{student.twelfthMark}</td>
                    <td>{student.className}</td>
                    <td>{student.department}</td>
                    {(userRole === 'placementofficer' || userRole === 'admin') && (
                        <td>{student.selectionStatus}</td>
                      )}
                      {userRole === 'placementofficer' && (
                        <td>
                          <button
                            className={`action-btn ${
                              student.selectionStatus === 'selected' ? 'unselect' : 'select'
                            }`}
                            onClick={() =>
                              handleSelectToggle(student._id, student.selectionStatus)
                            }
                          >
                            {student.selectionStatus === 'selected' ? 'Unselect' : 'Select'}
                          </button>
                        </td>
                      )}

                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppliedStudentList;