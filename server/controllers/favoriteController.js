const { Favorite, Movie } = require("../models/index");

module.exports = class FavoriteController {
  static async getFavorite(req, res) {
    try {
      const favorites = await Favorite.findAll({
        where: { UserId: req.user.id },
        include: [Movie],
      });

      res.status(200).json(favorites);
    } catch (error) {
      console.error("Error fetching favorite movies:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async addMovieToFavorite(req, res) {
    try {
      const { movieId } = req.body;
      let data = await Movie.findByPk(movieId);
      let find = await Favorite.findOne({
        where: {
          UserId: req.user.id,
          MovieId: movieId,
        },
      });

      if (find) {
        return res.status(400).json({ message: "Movie already in favorites" });
      }

      if (!data) {
        return res.status(404).json({ message: "Movie not found" });
      }

      await Favorite.create({
        UserId: req.user.id,
        MovieId: movieId,
        note: "",
      });

      res.status(201).json({ message: "Movie added to favorites" });
    } catch (error) {
      console.error("Error adding movie to favorites:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async updateFavoriteNote(req, res) {
    try {
      const { movieId, note } = req.body;
      const favorite = await Favorite.findOne({
        where: {
          UserId: req.user.id,
          MovieId: movieId,
        },
      });

      if (!favorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      await favorite.update({ note });

      res.status(200).json({ message: "Note updated successfully" });
    } catch (error) {
      console.error("Error updating favorite note:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  static async removeMovieFromFavorite(req, res) {
    try {
      const { movieId } = req.params;
      const favorite = await Favorite.findOne({
        where: {
          UserId: req.user.id,
          MovieId: movieId,
        },
      });

      if (!favorite) {
        return res.status(404).json({ message: "Favorite not found" });
      }

      await favorite.destroy();
      res.status(200).json({ message: "Movie removed from favorites" });
    } catch (error) {
      console.error("Error removing movie from favorites:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};
