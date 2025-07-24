"use strict";
const axios = require("axios");
const { hashPassword } = require("../helpers/bcrypt");
require("dotenv").config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const API_KEY = process.env.API_KEY;
    const pages = 5;
    const fetchPages = [];

    for (let i = 1; i <= pages; i++) {
      fetchPages.push(
        axios.get("https://api.themoviedb.org/3/movie/popular", {
          params: {
            api_key: API_KEY,
            language: "en-US",
            page: i,
          },
        })
      );
    }

    const responses = await Promise.all(fetchPages);

    const allMovies = responses
      .flatMap((res) => res.data.results)
      .map((movie) => ({
        title: movie.title,
        overview: movie.overview,
        release_date: movie.release_date,
        poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        popularity: movie.popularity,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

    await queryInterface.bulkInsert("Users", [
      {
        name: "fredly",
        profilePict:
          "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fdefault-user&psig=AOvVaw0xQTae1njWOBwGCKMMHB4f&ust=1753262434769000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCOiLkdiR0I4DFQAAAAAdAAAAABAE",
        email: "fredly@gmail.com",
        password: hashPassword("fredly123"),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert("Movies", allMovies);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("Movies", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });

    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      restartIdentity: true,
      cascade: true,
    });
  },
};
