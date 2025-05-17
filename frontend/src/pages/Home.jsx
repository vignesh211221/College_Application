import { Link } from "react-router-dom";
import "../styles/Home.css"; 
import logo from "../assets/user.png"; 


const Home = () => {
    return (
        <div className="home-container">
            <img src={logo} alt="Logo" className="logo" />
            <h1 className="title">User Secure Authentication</h1>
            <p className="description">
               In User Secure Authentication with secure login and Registration functionality to access protected routes only  after successful authentication.
               Use standard Use standard mechanisms to handle password hashing, session management, and user role-based access control.
                Protected routes should restrict unauthorized access to sensitive functionalities..
            </p>
            <div className="button-group">
                <Link to="/register">
                    <button className="btn">Register</button>
                </Link>
                <Link to="/login">
                    <button className="btn">Login</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
