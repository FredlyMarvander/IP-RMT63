require("dotenv").config();
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
app.get("/profile", UserController.getUserProfile);
app.post("/login/google", UserController.googleLogin);

app.use(authentication);

app.get("/movies", MovieController.getMovies);
app.get("/movies/:movieId", MovieController.getMovieDetails);
app.post("/favorite", FavoriteController.addMovieToFavorite);
app.get("/favorite", FavoriteController.getFavorite);
app.put("/favorite/:movieId", FavoriteController.updateFavoriteNote);
app.delete("/favorite/:movieId", FavoriteController.removeMovieFromFavorite);

module.exports = app;
