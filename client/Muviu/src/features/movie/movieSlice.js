import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import Swal from "sweetalert2";
import { serverApi } from "../../api";
import errorAlert from "../../sweetAlert";

export const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    movieDetail: {
      Favorites: [
        {
          notes: "",
        },
      ],
    },
    user: {},
    favorite: [],
    loading: false,
    error: null,
  },

  reducers: {
    setMovies: (state, action) => {
      state.movies = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.loading = false;
      state.movies = action.payload;
    });

    builder
      .addCase(fetchMoviesDetail.pending, (s) => {
        s.loadingDetail = true;
        s.errorDetail = null;
      })
      .addCase(fetchMoviesDetail.fulfilled, (s, a) => {
        s.loadingDetail = false;
        s.movieDetail = a.payload;
      });

    builder
      .addCase(fetchUser.pending, (s) => {
        s.loadingUser = true;
        s.errorUser = null;
      })
      .addCase(fetchUser.fulfilled, (s, a) => {
        s.loadingUser = false;
        s.user = a.payload;
      });

    builder
      .addCase(fetchFavorite.pending, (s) => {
        s.loadingFavorite = true;
        s.errorFavorite = null;
      })
      .addCase(fetchFavorite.fulfilled, (s, a) => {
        s.loadingFavorite = false;
        s.favorite = a.payload;
      });
  },
});

export const { setMovies } = movieSlice.actions;

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async ({ search, sort }) => {
    const searchParams = new URLSearchParams();
    searchParams.append("search", search);
    searchParams.append("sort", sort);

    try {
      const response = await serverApi.get(
        "/movies?" + searchParams.toString(),
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.log("Error fetching movies:", error);

      errorAlert("Failed to fetch movies");
    }
  }
);

export const fetchMoviesDetail = createAsyncThunk(
  "movies/fetchMoviesDetail",
  async (id) => {
    try {
      const response = await serverApi.get("/movies/" + id, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Error fetching movies detail:", error);

      errorAlert("Failed to fetch movies");
    }
  }
);

export const addMovieToFavorite = createAsyncThunk(
  "favorite/addMovieToFavorite",
  async (movieId) => {
    try {
      const response = await serverApi.post(
        "/favorite",
        {
          movieId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      Swal.fire({
        position: "top-end",
        icon: "success",
        title: response.data.message,
        showConfirmButton: false,
        timer: 1000,
      });
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  }
);

export const fetchUser = createAsyncThunk("users/fetchUser", async () => {
  try {
    const response = await serverApi.get("/profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });

    return response.data;
  } catch (error) {
    console.log("Error at User Thunk", error);
  }
});

export const fetchFavorite = createAsyncThunk(
  "users/fetchFavorite",
  async () => {
    try {
      const response = await serverApi.get("/favorite", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      return response.data;
    } catch (error) {
      console.log("Error at User Thunk", error);
    }
  }
);

export const updateNote = createAsyncThunk(
  "favorite/updateNote",
  async ({ notes, id }) => {
    const response = await serverApi.put(
      "/favorite/" + id,
      {
        notes,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    console.log(response.data, "tesssss");
  }
);

export const removeMovieFromFavorite = createAsyncThunk(
  "favorite/removeMovieFromFavorite",
  async (movieId, thunkAPI) => {
    try {
      const response = await serverApi.delete("/favorite/" + movieId, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      thunkAPI.dispatch(fetchFavorite());
    } catch (error) {
      console.log("Error at Remove Thunk", error);
    }
  }
);

export default movieSlice.reducer;
