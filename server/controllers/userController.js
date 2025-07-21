const url =
  "https://api.themoviedb.org/3/movie/popular?api_key=a8a4b50b025e54e593167639973d34ec&language=en-US&page=1";
module.exports = class UserController {
  static async tes(req, res) {
    try {
      const response = await fetch(url);
      let data = await response.json();
      data = data.results.map((movie) => {
        return movie.original_title;
      });
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }
};
