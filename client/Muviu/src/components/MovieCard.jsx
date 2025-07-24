import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../features/movie/movieSlice";
import "./MovieCard.css";
import { Link } from "react-router";

export default function MovieCard() {
  const { movies } = useSelector((state) => state.movie);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMovies());
  }, []);

  const listMovies = movies.map((movie) => {
    return (
      <div className="col-md-3" key={movie.id}>
        <Link to={`/detail/${movie.id}`}>
          <div className="movie-card card h-100 border-0">
            <img
              src={movie.poster_path}
              alt="movie-poster"
              className="movie-card-img"
            />
            <div className="movie-card-body">
              <h5 className="movie-card-title">{movie.title}</h5>
            </div>
          </div>
        </Link>
      </div>
    );
  });
  return (
    <div className="col-md-10">
      <div className="row g-4">
        <div className="d-flex justify-content-between align-items-center w-100">
          <select className="form-select w-100">
            <option>Latest</option>
            <option>Oldest</option>
          </select>
        </div>
        {listMovies}
      </div>
    </div>
  );
}
