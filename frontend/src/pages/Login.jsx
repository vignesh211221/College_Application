import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService"; // Adjust path if needed
import "../styles/Auth.css"; // Ensure proper styling
import logo from "../assets/logo.png";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear any previous error

        try {
            // Call the login API service
            const response = await authService.login(email, password);
            console.log("Login Response:", response);  // Debugging response

            if (response?.token && response?.role) {
                // Set a default username if it's missing or empty
                const userName = response.username?.trim() || "User";
                const department = response.department || "";
                const className = response.className || "Unknown"; // Default to 'Unknown' if className is missing

                // Build the user object
                const userObject = {
                    name: userName,
                    department: department,
                    className: className,
                    
                };

                const lowerRole = response.role.toLowerCase();
                if ((lowerRole === "staff" || lowerRole === "hod" || lowerRole === "placementcoordinator") && response.staffId) {
                  userObject.staffId = response.staffId;
                }

                // Store values in localStorage, including userId
                localStorage.setItem("token", response.token);
                localStorage.setItem("role", response.role.toLowerCase());
                localStorage.setItem("user", JSON.stringify(userObject));
                localStorage.setItem("userId", response.userId); // Storing userId

                // Role-based redirection
                const roleRedirects = {
                    student: "/student-dashboard",
                    admin: "/admin-dashboard",
                    hod: "/hod-dashboard",
                    placementofficer: "/placement-dashboard",
                    staff: "/staff-dashboard",
                    placementcoordinator: "/coordinator-dashboard"
                };

                const redirectPath = roleRedirects[response.role.toLowerCase()];

                if (redirectPath) {
                    navigate(redirectPath);
                } else {
                    setError("Unauthorized role.");
                }
            } else {
                console.error("Invalid Response Structure:", response);
                setError("Login failed: Invalid response from server.");
            }
        } catch (error) {
            console.error("Login Error:", error.message);
            setError(error.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="register-container">
             <img src={logo} alt="Logo" className="logo" />
            <div className="card">
                <h2>Login</h2>
                {/* Displaying error messages */}
                {error && <p className="error-message">{error}</p>}
                
                <form onSubmit={handleSubmit}>
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
                    <br />
                    <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
                    <br /><br />
                    <button type="submit" className="submit-btn">Login</button>
                </form>

                {/* <p>Don't have an account? <a href="/register" className="login-link">Register</a></p> */}
            </div>
        </div>
    );
};

export default Login;
