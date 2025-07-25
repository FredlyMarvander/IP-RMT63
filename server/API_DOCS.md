# Muviu API Documentation

## Base URL

```
https://muviu.fredlymarvander.com
```

## Authentication

Most endpoints require authentication using Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

---

## User Endpoints

### 1. Register User

**POST** `/register`

Register a new user account.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "profilePict": "https://example.com/profile.jpg"
}
```

**Response:**

- **201 Created**

```json
{
  "name": "John Doe",
  "profilePict": "https://example.com/profile.jpg"
}
```

- **400 Bad Request**

```json
{
  "message": "Email is required" // or other validation errors
}
```

### 2. Login User

**POST** `/login`

Login with email and password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

- **200 OK**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

- **400 Bad Request**

```json
{
  "message": "Email is required" // or "Password is required"
}
```

- **401 Unauthorized**

```json
{
  "message": "Invalid email/password"
}
```

### 3. Google Login

**POST** `/login/google`

Login using Google OAuth.

**Request Body:**

```json
{
  "id_token": "google_id_token_here"
}
```

**Response:**

- **200 OK**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "name": "John Doe",
  "profilePicture": "https://lh3.googleusercontent.com/..."
}
```

- **400 Bad Request**

```json
{
  "error": "Missing id_token in request"
}
```

### 4. Get User Profile

**GET** `/profile`

Get current user's profile information.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

- **200 OK**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "profilePict": "https://example.com/profile.jpg",
  "createdAt": "2025-01-20T10:00:00.000Z",
  "updatedAt": "2025-01-20T10:00:00.000Z"
}
```

---

## Movie Endpoints

### 1. Get Movies

**GET** `/movies`

Get list of movies with optional filtering, sorting, and pagination.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `search` (optional): Search movies by title
- `sort` (optional): Sort by popularity (`ASC` or `DESC`)
- `page` (optional): Page number for pagination (10 items per page)

**Examples:**

```
GET /movies
GET /movies?search=avengers
GET /movies?sort=ASC
GET /movies?page=2
GET /movies?search=action&sort=DESC&page=1
```

**Response:**

- **200 OK**

```json
[
  {
    "id": 1,
    "title": "Avengers: Endgame",
    "overview": "The grave course of events...",
    "release_date": "2019-04-24",
    "popularity": 356.027,
    "poster_path": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z"
  }
]
```

### 2. Get Movie Details

**GET** `/movies/:movieId`

Get detailed information about a specific movie.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Parameters:**

- `movieId`: Movie ID

**Response:**

- **200 OK**

```json
{
  "id": 1,
  "title": "Avengers: Endgame",
  "overview": "The grave course of events...",
  "release_date": "2019-04-24",
  "popularity": 356.027,
  "poster_path": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
  "createdAt": "2025-01-20T10:00:00.000Z",
  "updatedAt": "2025-01-20T10:00:00.000Z",
  "Favorites": []
}
```

- **404 Not Found**

```json
{
  "message": "Movie not found"
}
```

### 3. Get AI Recommendations

**POST** `/recommendations`

Get AI-powered movie recommendations based on user preferences.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "userResponse": "loves action movies with superheroes"
}
```

**Response:**

- **200 OK**

```json
[
  {
    "id": 1,
    "title": "Avengers: Endgame",
    "overview": "The grave course of events...",
    "release_date": "2019-04-24",
    "popularity": 356.027,
    "poster_path": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
  },
  {
    "id": 5,
    "title": "Spider-Man: No Way Home",
    "overview": "Peter Parker's secret identity...",
    "release_date": "2021-12-15",
    "popularity": 289.045,
    "poster_path": "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg"
  }
]
```

---

## Favorite Endpoints

### 1. Get User Favorites

**GET** `/favorite`

Get all movies in user's favorites list.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

- **200 OK**

```json
[
  {
    "id": 1,
    "UserId": 1,
    "MovieId": 1,
    "notes": "Great movie!",
    "createdAt": "2025-01-20T10:00:00.000Z",
    "updatedAt": "2025-01-20T10:00:00.000Z",
    "Movie": {
      "id": 1,
      "title": "Avengers: Endgame",
      "overview": "The grave course of events...",
      "release_date": "2019-04-24",
      "popularity": 356.027,
      "poster_path": "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg"
    }
  }
]
```

### 2. Add Movie to Favorites

**POST** `/favorite`

Add a movie to user's favorites list.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "movieId": 1
}
```

**Response:**

- **201 Created**

```json
{
  "message": "Movie added to favorite"
}
```

- **400 Bad Request**

```json
{
  "message": "Movie already in favorite"
}
```

- **404 Not Found**

```json
{
  "message": "Movie not found"
}
```

### 3. Update Favorite Note

**PUT** `/favorite/:movieId`

Update notes for a movie in favorites.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Parameters:**

- `movieId`: Movie ID

**Request Body:**

```json
{
  "notes": "Updated notes about this movie"
}
```

**Response:**

- **200 OK**

```json
{
  "message": "Note updated successfully"
}
```

- **404 Not Found**

```json
{
  "message": "Favorite not found"
}
```

### 4. Remove Movie from Favorites

**DELETE** `/favorite/:movieId`

Remove a movie from user's favorites list.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Parameters:**

- `movieId`: Movie ID

**Response:**

- **200 OK**

```json
{
  "message": "Movie removed from favorite"
}
```

- **404 Not Found**

```json
{
  "message": "Favorite not found"
}
```

---

## Error Responses

### Common Error Codes

**401 Unauthorized**

```json
{
  "message": "Invalid token"
}
```

**500 Internal Server Error**

```json
{
  "message": "Internal Server Error"
}
```

---

## Data Models

### User

```json
{
  "id": "integer",
  "name": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "profilePict": "string (URL)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Movie

```json
{
  "id": "integer",
  "title": "string",
  "overview": "text",
  "release_date": "date",
  "popularity": "float",
  "poster_path": "string (URL)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Favorite

```json
{
  "id": "integer",
  "UserId": "integer (foreign key)",
  "MovieId": "integer (foreign key)",
  "notes": "text (optional)",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

---

## Authentication Flow

1. **Register** or **Login** to get access token
2. Include token in Authorization header for protected endpoints
3. Token format: `Bearer <access_token>`

## Rate Limiting

Currently no rate limiting is implemented.

## CORS

CORS is enabled for all origins.
