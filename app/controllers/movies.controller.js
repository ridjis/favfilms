require("dotenv").config();
const request = require("request");

const URI = "https://api.themoviedb.org/3/search/movie?language=en-US&query=";

module.exports = {
	search: (req, res) => {
		const url = URI + req.body.query + process.env.TMDB_API;
		request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				let movies = [];
				for(movie of JSON.parse(body).results) {
					movies.push({
						id: movie.id,
						poster_path: movie.poster_path,
						title: movie.original_title,
						year: movie.release_date.substring(0, 4),
						plot: movie.overview
					});
				}
				res.render("pages/results", {
					query: req.body.query,
					results: movies
				});
			}
		})
	}
};