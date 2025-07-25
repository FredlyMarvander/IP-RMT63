import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovies } from "../features/movie/movieSlice";
import "./MovieCard.css";
import { Link } from "react-router";
import { useState } from "react";

export default function MovieCard() {
  const { movies } = useSelector((state) => state.movie);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  useEffect(() => {
    dispatch(fetchMovies({ search, sort }));
  }, [search, sort]);

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
              <h5 className="movie-card-title" style={{ color: "white" }}>
                {movie.title}
              </h5>
            </div>
          </div>
        </Link>
      </div>
    );
  });
  return (
    <>
      <div className="col-md-2 mb-4">
        <div className="bg-light p-3 rounded">
          <h6 className="mb-3">Search</h6>
          <input
            className="form-control mb-3"
            placeholder="Search Movie"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className="col-md-10">
        <div className="row g-4">
          <div className="d-flex justify-content-between align-items-center w-100">
            <select
              className="form-select w-100"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="DESC">Most Popular</option>
              <option value="ASC">Less Popular</option>
            </select>
          </div>

          {listMovies}
        </div>
      </div>
    </>
  );
}
