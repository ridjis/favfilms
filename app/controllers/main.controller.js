const request = require("request"),
	Movie = require("../models/movie.js");

module.exports = {
	index: (req, res) => {
		Movie.find({}, {}, {sort: {favs: -1}}, (err, movies) => {
			if (err) throw err;

			res.render("pages/adv-cards", {
				header: "Most favorited movies",
				results: movies
			});
		});
	}
}