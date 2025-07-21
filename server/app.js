require("dotenv").config();
const express = require("express");
const UserController = require("./controllers/userController");

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", UserController.tes);

module.exports = app;
