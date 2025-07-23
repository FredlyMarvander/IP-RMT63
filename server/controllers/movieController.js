const { Movie, Favorite } = require("../models/index");
const { Op } = require("sequelize");
const { gemini } = require("../helpers/gemini");

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

  static async getRecommendations(req, res) {
    try {
      const { userResponse } = req.body;
      const movies = await Movie.findAll();

      const prompt = `
        Recommend top 5 movies based on user preferences.
        The user enjoys movies where ${userResponse}.

        You can only pick from the following movies:
        ${movies.map((movie) => `- ${movie.id}:${movie.title}`).join("\n")}

        Response only with id from above data. In shape of Array of number (ID).
        Example: [1, 2, 3]
      `;

      const recommendations = await gemini(prompt);
      const recommendationsArray = JSON.parse(recommendations);

      const recommendedMovies = movies.filter((movie) =>
        recommendationsArray.includes(movie.id)
      );

      res.json(recommendedMovies);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
