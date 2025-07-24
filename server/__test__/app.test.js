jest.mock("../helpers/gemini", () => jest.fn(() => Promise.resolve("[1,2,3]")));

const request = require("supertest");
require("dotenv").config();
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const { signToken } = require("../helpers/jwt");
const { hashPassword } = require("../helpers/bcrypt");
const {
  test,
  expect,
  describe,
  beforeAll,
  afterAll,
} = require("@jest/globals");
const axios = require("axios");
const { User, Movie } = require("../models");
const e = require("express");
let access_token;

beforeAll(async () => {
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

  const user = await User.findOne({ where: { email: "fredly@gmail.com" } });
  access_token = signToken({ id: user.id });
});

afterAll(async () => {
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
});

describe("Google Login Feature", () => {
  test("POST /googleLogin - Missing id_token", async () => {
    const response = await request(app).post("/login/google").send({});
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "error",
      "Missing id_token in request"
    );
  });
  test("POST /googleLogin - Internal Server Error", async () => {
    const response = await request(app)
      .post("/login/google")
      .send({ id_token: "invalid_token" });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("Register Feature", () => {
  test("POST /register - success", async () => {
    const userData = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "password123",
      profilePict: "https://example.com/profile.jpg",
    };
    const response = await request(app).post("/register").send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("name", userData.name);
  });

  test("POST /register - Email is required", async () => {
    const userData = {
      name: "John Doe",

      password: "password123",
      profilePict: "https://example.com/profile.jpg",
    };
    const response = await request(app).post("/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("POST /register - Email is required", async () => {
    const userData = {
      name: "John Doe",
      email: "johndoe@gmail.com",

      profilePict: "https://example.com/profile.jpg",
    };
    const response = await request(app).post("/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("POST /register - success", async () => {
    const userData = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "password123",
      profilePict: "https://example.com/profile.jpg",
    };
    const response = await request(app).post("/register").send(userData);

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email must be unique");
  });
});

describe("Login Feature", () => {
  test("POST /login - success", async () => {
    const userData = {
      email: "johndoe@gmail.com",
      password: "password123",
    };

    const response = await request(app).post("/login").send(userData);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("access_token");
  });

  test("POST /login - Email is required", async () => {
    const userData = {
      password: "password123",
    };

    const response = await request(app).post("/login").send(userData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Email is required");
  });

  test("POST /login - Password is required", async () => {
    const userData = {
      email: "fredly@gmail.com",
    };
    const response = await request(app).post("/login").send(userData);
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message", "Password is required");
  });

  test("POST /login - Invalid email/password", async () => {
    const userData = {
      email: "aaa@gmail.com",
      password: "aaa",
    };
    const response = await request(app).post("/login").send(userData);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid email/password");
  });

  test("POST /login - Invalid email/password", async () => {
    const userData = {
      email: "fredly@gmail.com",
      password: "aaa",
    };
    const response = await request(app).post("/login").send(userData);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid email/password");
  });
});

describe("User Profile Feature", () => {
  test("GET /profile - success", async () => {
    const response = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("profilePict");
  });
});

describe("Movie Feature", () => {
  test("GET /movies - Success", async () => {
    const response = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    const isArray = Array.isArray(response.body);
    expect(isArray).toBeTruthy();
  });

  test("GET /movies - Search by title", async () => {
    const response = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${access_token}`)
      .query({ search: "How" });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /movies - Sort by popularity", async () => {
    const response = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${access_token}`)
      .query({ sort: "ASC" });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /movies - Pagination", async () => {
    const response = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${access_token}`)
      .query({ page: 1 });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test("GET /movies - Invalid token (No token)", async () => {
    const response = await request(app).get("/movies");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("GET /movies - Invalid token (Wrong token)", async () => {
    const response = await request(app)
      .get("/movies")
      .set("Authorization", `Bearer ${access_token}invalid`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("GET /movies/:id - success", async () => {
    const response = await request(app)
      .get("/movies/1")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  test("GET /movies/:id - Movie not found", async () => {
    const response = await request(app)
      .get("/movies/9999")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Movie not found");
  });
});

describe("GET /favorite", () => {
  test("GET /favorite - success", async () => {
    const response = await request(app)
      .get("/favorite")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test("GET /favorite - Invalid token (No token)", async () => {
    const response = await request(app).get("/favorite");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("GET /favorite - Invalid token (Wrong token)", async () => {
    const response = await request(app)
      .get("/favorite")
      .set("Authorization", `Bearer ${access_token}invalid`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("POST /favorite", () => {
  test("POST /favorite - Add movie to favorite - success", async () => {
    const response = await request(app)
      .post("/favorite")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ movieId: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("message", "Movie added to favorite");
  });

  test("POST /favorite - Add movie to favorite - Movie not found", async () => {
    const response = await request(app)
      .post("/favorite")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ movieId: 9999 });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Movie not found");
  });

  test("POST /favorite - Add movie to favorite - Movie already in favorite", async () => {
    const response = await request(app)
      .post("/favorite")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ movieId: 1 });
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Movie already in favorite"
    );
  });

  test("POST /favorite - Invalid token (No token)", async () => {
    const response = await request(app)
      .post("/favorite")

      .send({ movieId: 2 });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("POST /favorite - Invalid token (wrong token)", async () => {
    const response = await request(app)
      .post("/favorite")
      .set("Authorization", `Bearer ${access_token}invalid`)
      .send({ movieId: 2 });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("POST /favorite - Internal server error", async () => {
    const response = await request(app)
      .post("/favorite")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ movieId: "abc" });
    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Internal Server Error");
  });
});

describe("PUT /favorite/:movieId", () => {
  test("PUT /favorite/:movieId - Update favorite note - success", async () => {
    const response = await request(app)
      .put("/favorite/1")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ notes: "Great movie!" });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Note updated successfully"
    );
  });
  test("PUT /favorite/:movieId - Update favorite note - Favorite not found", async () => {
    const response = await request(app)
      .put("/favorite/9999")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ notes: "Great movie!" });
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Favorite not found");
  });

  test("PUT /favorite/:movieId - Update favorite note - Invalid token (No token)", async () => {
    const response = await request(app)
      .put("/favorite/9999")

      .send({ notes: "Great movie!" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("PUT /favorite/:movieId - Update favorite note - Invalid token (No token)", async () => {
    const response = await request(app)
      .put("/favorite/9999")
      .set("Authorization", `Bearer ${access_token}invalid`)
      .send({ notes: "Great movie!" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("DELETE /favorite/:movieId", () => {
  test("DELETE /favorite/:movieId - Remove movie from favorite - success", async () => {
    const response = await request(app)
      .delete("/favorite/1")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      "message",
      "Movie removed from favorite"
    );
  });

  test("DELETE /favorite/:movieId - Remove movie from favorite - Favorite not found", async () => {
    const response = await request(app)
      .delete("/favorite/9999")
      .set("Authorization", `Bearer ${access_token}`);
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Favorite not found");
  });

  test("DELETE /favorite/:movieId - Remove movie from favorite - Invalid token (No token)", async () => {
    const response = await request(app).delete("/favorite/9999");
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("DELETE /favorite/:movieId - Remove movie from favorite - Invalid token (wrong token)", async () => {
    const response = await request(app)
      .delete("/favorite/9999")
      .set("Authorization", `Bearer ${access_token}invalid`);
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});

describe("POST /recommendations", () => {
  test("POST /recommendations - success", async () => {
    const response = await request(app)
      .post("/recommendations")
      .set("Authorization", `Bearer ${access_token}`)
      .send({ userResponse: "loves action movies" });
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test("POST /recommendations - Invalid token (No token)", async () => {
    const response = await request(app)
      .post("/recommendations")
      .send({ userResponse: "loves action movies" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });

  test("POST /recommendations - Invalid token (wrong token)", async () => {
    const response = await request(app)
      .post("/recommendations")
      .set("Authorization", `Bearer ${access_token}invalid`)
      .send({ userResponse: "loves action movies" });
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid token");
  });
});
