import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router";
import { fetchUser } from "../features/movie/movieSlice";

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
            <img className="muviu-logo" src="/image/Muviu.png" alt="Muviu" />
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
            <h4
              className="position-absolute top-50  translate-middle my-0 "
              style={{ left: "47%" }}
            >
              Welcome, {user.name}
            </h4>

            <form className="d-flex gap-5 align-items-center" role="search">
              <Link className="nav-link my-0 " to="favorite">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ height: "2rem", width: "2rem" }}
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="icon icon-tabler icons-tabler-filled icon-tabler-heart"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M6.979 3.074a6 6 0 0 1 4.988 1.425l.037 .033l.034 -.03a6 6 0 0 1 4.733 -1.44l.246 .036a6 6 0 0 1 3.364 10.008l-.18 .185l-.048 .041l-7.45 7.379a1 1 0 0 1 -1.313 .082l-.094 -.082l-7.493 -7.422a6 6 0 0 1 3.176 -10.215z" />
                </svg>
              </Link>

              <button
                className="btn btn-outline-dark"
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </nav>
    </>
  );
}
