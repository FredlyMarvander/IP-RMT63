import { useParams } from "react-router";
import { fetchMoviesDetail } from "../features/movie/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function Update() {
  const { id } = useParams();

  const { movieDetail } = useSelector((state) => state.movie);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMoviesDetail(id));
  }, []);

  console.log(movieDetail);

  return (
    <>
      <form className="mt-5 w-25 m-auto p-4 border rounded">
        <h2 className="text-center my-4" style={{ fontWeight: "700" }}>
          Notes
        </h2>

        <div className="mb-4">
          <textarea
            rows="6"
            cols="50"
            placeholder="Write Some Note..."
            className="form-control"
            id="exampleInputPassword1"
            value={movieDetail}
          />
        </div>

        <button type="submit" className="btn btn-dark w-100 mt-1">
          Update
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
