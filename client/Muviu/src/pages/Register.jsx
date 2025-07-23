import { Navigate, useNavigate } from "react-router";
import { serverApi } from "../api";
import { useState } from "react";
import errorAlert from "../sweetAlert";

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
    <>
      <form
        className="mt-5 w-25 m-auto p-4 border rounded"
        onSubmit={handleRegister}
      >
        <h2 className="text-center my-4" style={{ fontWeight: "700" }}>
          Sign Up
        </h2>
        <div className="mb-4">
          <label className="form-label">Username</label>
          <input
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Email address</label>
          <input
            className="form-control"
            aria-describedby="emailHelp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Profile Picture</label>
          <input
            className="form-control"
            id="exampleInputPassword1"
            value={profilePict}
            onChange={(e) => setProfilePict(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-dark w-100 mt-1">
          Register
        </button>
      </form>
    </>
  );
}
