import { useNavigate, useParams } from "react-router";
import { fetchMoviesDetail, updateNote } from "../features/movie/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import errorAlert from "../sweetAlert";

export default function Update() {
  const { id } = useParams();
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  const { movieDetail } = useSelector((state) => state.movie);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMoviesDetail(id));
  }, []);

  useEffect(() => {
    if (movieDetail) {
      setNotes(movieDetail.Favorites[0].notes);
    }
  }, [movieDetail]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      console.log(notes, id);

      await dispatch(updateNote({ notes, id }));
      navigate("/favorite");
    } catch (error) {
      console.log("Error at Update.jsx", error);
    }
  };

  return (
    <>
      <form
        className="mt-5 w-25 m-auto p-4 border rounded"
        onSubmit={handleUpdate}
      >
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
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
