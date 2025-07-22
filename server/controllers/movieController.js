const { Movie, Favorite } = require("../models/index");
const { Op } = require("sequelize");

module.exports = class MovieController {
  static async getMovies(req, res) {
    try {
      let option = {};
      const { search, sort, page } = req.query;
      if (search) {
        option.where = {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        };
      }
      if (sort) {
        option.order = [["popularity", sort]];
      } else {
        option.order = [["popularity", "DESC"]];
      }

      if (page) {
        const limit = 10;
        const offset = (page - 1) * limit;
        option.limit = limit;
        option.offset = offset;
      }

      const movies = await Movie.findAll(option);
      res.status(200).json(movies);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getMovieDetails(req, res) {
    try {
      const { movieId } = req.params;
      const movie = await Movie.findByPk(movieId);

      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }

      res.status(200).json(movie);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};
