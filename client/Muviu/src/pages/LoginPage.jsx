import { useEffect } from "react";
import { serverApi } from "../api";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import errorAlert from "../sweetAlert";
import "../styles/auth.css";
import { use } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rerender, setRerender] = useState(false);

  const token = localStorage.getItem("access_token");
  if (token) {
    return <Navigate to="/" />;
  }

  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("accessToken");

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("access_token", accessToken);

      setRerender(!rerender);
      window.location.href = "/";
    }
  }, [accessToken]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const codeParam = urlParams.get("code");

    if (codeParam && localStorage.getItem("access_token") === null) {
      async function getAccessToken() {
        await fetch(
          "https://muviu.fredlymarvander.com/getAccessToken?code=" + codeParam,
          {
            method: "GET",
          }
        )
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            console.log(data);
            if (data.access_token) {
              localStorage.setItem("access_token", data.access_token);
              setRerender(!rerender);
            }
          });
      }
      getAccessToken();
    }
  }, []);

  function loginWithGitHub() {
    window.location.assign(
      "https://github.com/login/oauth/authorize?client_id=" +
        import.meta.env.VITE_CLIENT_ID_GITHUB
    );
  }

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    try {
      e.preventDefault();

      const response = await serverApi.post("/login", {
        email,
        password,
      });

      localStorage.setItem("access_token", response.data.access_token);
      Swal.fire({
        icon: "success",
        title: "Login successful!",
        confirmButtonColor: "#222831",
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
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleLogin}>
        <h2 className="auth-title">Sign In</h2>

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

        <button type="submit" className="auth-button">
          Sign In
        </button>

        <div className="google-signin">
          <div className="google-signin-text">Or continue with</div>
          <div id="buttonDiv"></div>
        </div>

        <button className="btn btn-dark w-100 mt-2" onClick={loginWithGitHub}>
          Login with GitHub
        </button>

        <div className="link-text">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </div>
      </form>
    </div>
  );
}
