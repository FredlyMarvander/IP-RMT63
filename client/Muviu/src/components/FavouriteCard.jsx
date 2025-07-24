import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFavorite,
  removeMovieFromFavorite,
} from "../features/movie/movieSlice";
import { Link } from "react-router";

export default function FavoriteCard() {
  const { favorite } = useSelector((state) => state.movie);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchFavorite());
  }, []);

  console.log(favorite);

  let listFavorite;
  if (favorite.length > 0) {
    listFavorite = favorite.map((el) => {
      return (
        <>
          <div className="col-md-3" key={el.Movie.id}>
            <div
              className="movie-card card h-100 border-0"
              style={{ width: "17rem" }}
            >
              <img
                src={el.Movie.poster_path}
                alt={el.Movie.title}
                className="movie-card-img"
              />
              <div className="movie-card-body">
                <h5 className="movie-card-title mb-2">{el.Movie.title}</h5>

                <div className="d-flex gap-2">
                  <Link
                    to={`/update/${el.Movie.id}`}
                    className="btn btn-light w-100"
                  >
                    View Note
                  </Link>
                  <button
                    onClick={() =>
                      dispatch(removeMovieFromFavorite(el.MovieId))
                    }
                    className="btn btn-light w-100"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ))} */}
        </>
      );
    });
  } else {
    listFavorite = (
      <>
        <div
          className="d-flex flex-column justify-content-center align-items-center text-center"
          style={{ height: "70vh", width: "100%" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={196}
            height={196}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
          </svg>
          <p className="fs-5 mb-2">This heart is still empty…</p>
          <p className="text-muted">
            Add some favorite movies to fill it with joy
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="row">{listFavorite}</div>
    </>
  );
}
