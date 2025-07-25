import { Link, Navigate, useNavigate } from "react-router";
import { serverApi } from "../api";
import { useState } from "react";
import errorAlert from "../sweetAlert";
import "../styles/auth.css";

export default function Register() {
  const token = localStorage.getItem("access_token");
  if (token) {
    return <Navigate to="/" />;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [profilePict, setProfilePict] = useState("");

  const navigate = useNavigate();
  const handleRegister = async (e) => {
    try {
      e.preventDefault();

      const response = await serverApi.post("/register", {
        email,
        password,
        name,
        profilePict,
      });

      navigate("/login");
    } catch (error) {
      console.log("Error during registration:", error);
      errorAlert(error.response.data.message);
    }
  };
  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2 className="auth-title">Sign Up</h2>

        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            placeholder="Enter your username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-input"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Profile Picture URL</label>
          <input
            className="form-input"
            placeholder="Enter profile picture URL (optional)"
            value={profilePict}
            onChange={(e) => setProfilePict(e.target.value)}
          />
        </div>

        <button type="submit" className="auth-button">
          Create Account
        </button>

        <div className="link-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </form>
    </div>
  );
}
