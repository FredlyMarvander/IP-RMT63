import { useNavigate, useParams } from "react-router";
import { fetchMoviesDetail, updateNote } from "../features/movie/movieSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import errorAlert from "../sweetAlert";
import "../styles/auth.css";

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
    <div className="content-container mt-5">
      <form
        className="auth-card mx-auto"
        style={{ maxWidth: "500px" }}
        onSubmit={handleUpdate}
      >
        <h2 className="auth-title">Update Notes</h2>

        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            rows="6"
            placeholder="Write some notes about this movie..."
            className="form-input"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ minHeight: "150px", resize: "vertical" }}
          />
        </div>

        <button type="submit" className="auth-button">
          Update Notes
        </button>
      </form>
    </div>
  );
}
