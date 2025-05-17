import { useState } from "react";
import authService from "../services/authService";
import { Link, useNavigate } from "react-router-dom";  
import "../styles/Auth.css";


const Register = () => {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState(""); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await authService.register(username, email, password, role);
            localStorage.setItem("user", JSON.stringify(response.data));  
            navigate("/login");
        } catch (error) {
            setError(error.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="register-container">
            <div className="card">
            <h2>Register</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}  
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="hod">Hod</option>
                    <option value="placementOfficer">PlacementOfficer</option>
                </select>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;
