require("dotenv").config();
const request = require("request");

const URI = "https://api.themoviedb.org/3/movie/popular?language=en-US";

module.exports = {
	index: (req, res) => {
		//res.render("pages/home");
		const url = URI + process.env.TMDB_API;
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				let movies = [];
				for(movie of JSON.parse(body).results) {
					movies.push({
						poster_path: movie.poster_path,
						original_title: movie.original_title,
						release_year: movie.release_date.substring(0, 4),
						overview: movie.overview,
						id: movie.id
					});
				}
				res.render("pages/home", {
					results: movies
				});
			}
		})
	}
}