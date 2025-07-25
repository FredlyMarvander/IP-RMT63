if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { gemini } = require("./helpers/gemini");
const { User } = require("./models/index");
const express = require("express");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const bodyParser = require("body-parser");
const authentication = require("./middlewares/authentication");
const UserController = require("./controllers/userController");
const MovieController = require("./controllers/movieController");
const FavoriteController = require("./controllers/favoriteController");
const { signToken } = require("./helpers/jwt");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

app.post("/register", UserController.register);
app.post("/login", UserController.login);

app.post("/login/google", UserController.googleLogin);

app.get("/getAccessToken", async function (req, res) {
  console.log(req.query.code);

  const params =
    "?client_id=" +
    process.env.CLIENT_ID_GITHUB +
    "&client_secret=" +
    process.env.CLIENT_SECRET_GITHUB +
    "&code=" +
    req.query.code;

  const response = await fetch(
    "https://github.com/login/oauth/access_token" + params,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  );
  const data = await response.json();

  const response2 = await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + data.access_token,
      Accept: "application/json",
    },
  });

  const data2 = await response2.json();
  console.log(data2);

  const { name, login, avatar_url } = data2;
  let email = login + "@github.com";

  let user = await User.findOne({ where: { email } });
  if (!user) {
    user = await User.create({
      name,
      email,
      password: Math.random().toString(36).slice(-8),
      profilePicture: avatar_url,
    });
  }

  const access_token = signToken({ id: user.id });
  res.redirect(
    "https://muviu.fredlymarvander.com/login?accessToken=" + access_token
  );
});

app.get("/getUserData", async function (req, res) {
  req.get("Authorization");
  await fetch("https://api.github.com/user", {
    method: "GET",
    headers: {
      Authorization: "Bearer " + res.get("Authorization"),
      Accept: "application/json",
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
    });
});

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
