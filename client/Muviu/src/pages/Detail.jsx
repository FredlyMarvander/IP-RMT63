import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import {
  fetchMoviesDetail,
  addMovieToFavorite,
} from "../features/movie/movieSlice";
import errorAlert from "../sweetAlert";

export default function Detail() {
  const { id } = useParams();
  const { movieDetail } = useSelector((state) => state.movie);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMoviesDetail(id));
  }, []);

  const handleAdd = async (movieId) => {
    try {
      const response = await dispatch(addMovieToFavorite(movieId)).unwrap();
      console.log(response);

      navigate("/favorite");
    } catch (error) {
      console.log(error);

      errorAlert(error.message);
    }
  };

  return (
    <>
      <div className="container-fluid px-0">
        <div
          className="row gx-0 shadow-lg rounded overflow-hidden"
          style={{ minHeight: "90vh" }}
        >
          <div
            className="col-md-6 p-0 d-flex align-items-center justify-content-center"
            style={{ backgroundColor: "#000" }}
          >
            <img
              src={movieDetail.poster_path}
              alt={movieDetail.title}
              className="img-fluid"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
              }}
            />
          </div>

          <div className="col-md-6 bg-dark text-white d-flex flex-column p-4">
            <h1 className="h2 text-uppercase fw-bold mb-1">
              {movieDetail.title}
            </h1>
            <span className="badge bg-secondary text-uppercase mb-3">
              {movieDetail.release_date}
            </span>
            <p className="flex-grow-1" style={{ lineHeight: "1.6" }}>
              {movieDetail.overview}
            </p>
            <div className="mb-3">
              <span style={{ fontSize: "1.5rem" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-users"
                  style={{
                    marginRight: "5px",
                    marginBottom: "3px",
                    width: "1.5rem",
                    height: "1.8rem",
                  }}
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                </svg>

                {movieDetail.popularity}
              </span>
            </div>
            <button
              className="btn btn-danger mt-auto w-100"
              onClick={() => handleAdd(movieDetail.id)}
            >
              Add to Favorites
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
