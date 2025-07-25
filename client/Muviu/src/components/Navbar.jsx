import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router";
import { fetchUser } from "../features/movie/movieSlice";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");
  if (!token) {
    return <Navigate to="/login" />;
  }

  const { user } = useSelector((state) => state.movie);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand">
            <img
              style={{ width: "60px", height: "60px" }}
              className="muviu-logo"
              src="/image/Muviu.png"
              alt="Muviu"
            />
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="collapse navbar-collapse position-relative"
            id="navbarSupportedContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>

            <span
              style={{
                position: "absolute",
                left: "47%",
              }}
              className="text-muted navbar-text translate-middle-x text-center"
            >
              Welcome, {user.name || "User"}
            </span>

            <div className="d-flex align-items-center gap-3">
              <Link className="btn btn-outline-dark btn-sm" to="/favorite">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: "1.2rem", width: "1.2rem" }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="me-1"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
                </svg>
                <span className="d-none d-sm-inline">Favorites</span>
              </Link>
              <button
                className="btn btn-outline-dark btn-sm"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
