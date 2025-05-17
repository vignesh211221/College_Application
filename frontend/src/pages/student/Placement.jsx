import { useEffect, useState } from "react";
import { getPlacementsByStudent, applyForPlacement } from "../../services/studentApi";
import { useNavigate, useParams } from "react-router-dom";
import "./Placement.css";
import Navbar from "../../components/Navbar";

function Placements() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [isLinkClicked, setIsLinkClicked] = useState(false); // Track if Apply Link is clicked
  const [showMessage, setShowMessage] = useState(false); // Track if the red message should be shown
  const [hasClickedCancel, setHasClickedCancel] = useState(false); // Track if Cancel has been clicked

  const fetchPlacements = async () => {
    try {
      const res = await getPlacementsByStudent(studentId);
      setPlacements(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching placements", err);
      setLoading(false);
    }
  };

  const handleApply = async (placementId) => {
    try {
      await applyForPlacement(studentId, placementId);
      alert("Applied successfully!");
      fetchPlacements(); // Refresh placements after applying
    } catch (err) {
      alert("Already applied or error occurred!");
    }
  };

  const openModal = (placement) => {
    setSelectedPlacement(placement);
    setIsLinkClicked(false); // Reset link clicked state when opening a new modal
    setShowMessage(false); // Reset message state
    setHasClickedCancel(false); // Reset Cancel button state
  };

  const closeModal = () => {
    setSelectedPlacement(null);
    setIsLinkClicked(false); // Reset link clicked state when closing the modal
    setHasClickedCancel(true); // Set the state to true after Cancel is clicked
  };

  const handleLinkClick = () => {
    setIsLinkClicked(true); // Set to true when the Apply Link is clicked
    setShowMessage(true);  // Show red message after link click
  };

  useEffect(() => {
    fetchPlacements();
  }, [studentId]);

  if (loading) return <p>Loading placements...</p>;

  return (
    <div>
      <Navbar onLogout={() => navigate("/login")} />
                  <br></br>
              <button onClick={() => navigate(-1)} className="back-btn">
                  Back
              </button>
              <br></br>
              <br></br>
    <div className="placements-container">
      <h2>Available Placements</h2>
      {placements.length === 0 ? (
        <p>No placements available.</p>
      ) : (
        <div className="placements-grid">
          {placements.map((placement) => (
            <div
              key={placement._id}
              className="placement-card"
              onClick={() => openModal(placement)} // Open modal on card click
            >
              <h4>{placement.companyName}</h4>
              <p><strong>Type:</strong> {placement.type}</p>
              <p><strong>Role:</strong> {placement.jobRole}</p>
              <p><strong>Location:</strong> {placement.location || 'N/A'}</p>
              <p><strong>Last Date:</strong> {new Date(placement.expiryDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedPlacement && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedPlacement.companyName} - {selectedPlacement.jobRole}</h3>
            <p><strong>Description:</strong> {selectedPlacement.description || 'Not Provided'}</p>
            <p><strong>Skills Required:</strong> {selectedPlacement.skillsRequired?.join(", ") || 'Not Mentioned'}</p>
            <p><strong>Eligibility:</strong> {selectedPlacement.eligibility || 'Not Specified'}</p>
            <p><strong>Apply Link:</strong> 
              <a href={selectedPlacement.applyLink} target="_blank" rel="noopener noreferrer" onClick={handleLinkClick}>
                {selectedPlacement.applyLink}
              </a>
            </p>
            <p><strong>Departments:</strong> {selectedPlacement.departments.join(", ")}</p>
            <p><strong>Class Names:</strong> {selectedPlacement.classNames.join(", ")}</p>
            <p><strong>Regulations:</strong> {selectedPlacement.regulations.join(", ")}</p>
              <p style={{ color: 'red', fontWeight: 'bold' }}>
                Click on "Apply" after clicking the Apply Link above.
              </p>

            {/* Show only Cancel button before clicking the Apply Link */}
            {!isLinkClicked && !hasClickedCancel && (
              <div className="action-btns">
                <button onClick={closeModal}>Cancel</button>
              </div>
            )}

            {/* Show Apply and Cancel buttons after clicking the Apply Link */}
            {isLinkClicked && (
              <div className="action-btns">
                <button onClick={() => handleApply(selectedPlacement._id)}>Apply</button>
                <button onClick={closeModal}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

export default Placements;
