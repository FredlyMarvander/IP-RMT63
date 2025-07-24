"use strict";
const { Model } = require("sequelize");
const axios = require("axios");
const { hashPassword } = require("../helpers/bcrypt");
require("dotenv").config();
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.hasMany(models.Favorite);
    }
  }
  Movie.init(
    {
      title: DataTypes.STRING,
      overview: DataTypes.TEXT,
      release_date: DataTypes.STRING,
      popularity: DataTypes.STRING,
      poster_path: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Movie",
    }
  );
  return Movie;
};
