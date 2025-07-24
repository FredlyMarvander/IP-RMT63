import { useEffect } from "react";
import { serverApi } from "../api";
import { Navigate, useNavigate } from "react-router";
import { useState } from "react";
import errorAlert from "../sweetAlert";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const token = localStorage.getItem("access_token");
  if (token) {
    return <Navigate to="/" />;
  }

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      const response = await serverApi.post("/login", {
        email,
        password,
      });

      navigate("/");
    } catch (error) {
      console.log("Error during registration:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
        confirmButtonColor: "#222831",
      });
    }
  };

  const successToast = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success",
      text: message,
      confirmButtonColor: "#222831",
    });
  };

  async function handleCredentialResponse(response) {
    try {
      const { data } = await serverApi.post("/login/google", {
        id_token: response.credential,
      });

      localStorage.setItem("access_token", data.access_token);
      successToast("Login successful!");
      navigate("/");
    } catch (error) {
      errorAlert(error.response.data.message);
    }
  }

  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" } // customization attributes
    );
  });
  return (
    <>
      <form
        className="mt-5 w-25 m-auto p-4 border rounded"
        onSubmit={handleLogin}
      >
        <h2 className="text-center my-4" style={{ fontWeight: "700" }}>
          Sign In
        </h2>

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

        <button type="submit" className="btn btn-dark w-100 mt-1">
          Login
        </button>
        <div className="d-flex justify-content-center w-100">
          <div
            style={{ width: "100%" }}
            className="w-100 mt-4"
            id="buttonDiv"
          ></div>
        </div>
      </form>
    </>
  );
}
