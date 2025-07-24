if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { gemini } = require("./helpers/gemini");

const express = require("express");
const cors = require("cors");
const authentication = require("./middlewares/authentication");
const UserController = require("./controllers/userController");
const MovieController = require("./controllers/movieController");
const FavoriteController = require("./controllers/favoriteController");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.post("/register", UserController.register);
app.post("/login", UserController.login);

app.post("/login/google", UserController.googleLogin);

app.use(authentication);

app.get("/profile", UserController.getUserProfile);
app.post("/recommendations", MovieController.getRecommendations);
app.get("/movies", MovieController.getMovies);
app.get("/movies/:movieId", MovieController.getMovieDetails);
app.post("/favorite", FavoriteController.addMovieToFavorite);
app.get("/favorite", FavoriteController.getFavorite);
app.put("/favorite/:movieId", FavoriteController.updateFavoriteNote);
app.delete("/favorite/:movieId", FavoriteController.removeMovieFromFavorite);

module.exports = app;
