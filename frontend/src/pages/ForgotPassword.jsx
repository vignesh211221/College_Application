import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import authService from "../services/authService";
import "../styles/Auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate(); // Added useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.forgotPassword(email);
      alert("Password reset email sent. Check your inbox.");
      navigate("/login");
    } catch (error) {
      console.error("Error sending reset email:", error);
    }
  };

  return (
    <div className="register-container">
      <div className="card">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a reset link</p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
