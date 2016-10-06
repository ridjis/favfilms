require("dotenv").config();
const request = require("request"),
	  Movie = require("../models/movie.js");

const URI_POPULAR = "https://api.themoviedb.org/3/movie/popular?";
const URI_TOPRATED = "https://api.themoviedb.org/3/movie/top_rated?";
const URI_QUERY = "https://api.themoviedb.org/3/search/movie?query=";
const URI_DETAILS = "https://api.themoviedb.org/3/movie/";
const API_KEY = process.env.TMDB_API;
let GENRES = [];

module.exports = {
	search: (req, res) => {
		const url = URI_QUERY + req.body.query + "&" + API_KEY;
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
				res.render("pages/simple-cards", {
					header: "Results for " + req.body.query,
					results: movies
				});
			}
		});
	}, // end search
	fav: (req, res) => {
		Movie.findOne({id: req.params.movie_id}, (err, movie) => {
			if (err) throw err;
			
			if (movie) {
				// ako je pronađen film, povećati broj favs
				movie.favs = movie.favs + 1;
				movie.timestamp = new Date();
				movie.save((err) => {
					if (err) throw err;
					else res.json({favs: movie.favs});
				});
			} else {
				// dodaj u model i izvrši još 2 http zahtjeva za uloge i žanr
				const url_details = URI_DETAILS + req.params.movie_id + "?" + API_KEY;
				const url_credits = URI_DETAILS + req.params.movie_id + "/credits" + "?" + API_KEY; 
				let movie = {};
				request(url_details, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						body = JSON.parse(body);
						movie = {
							id: body.id,
							poster_path: body.poster_path,
							title: body.original_title,
							year: body.release_date.substring(0, 4),
							plot: body.overview,
							genres: body.genres.map((genre) => genre.name.replace(/\s+/g, '-'))
						};
						//movie.genres.map((genre) => genre.replace(/\s+/g, '-'));
						request(url_credits, function (error, response, body) {
							if (!error && response.statusCode == 200) {
								movie.cast = JSON.parse(body).cast.map((actor) => actor.name).slice(0, 6);
							}
							new Movie(movie).save((err, movie) => {
								if (err) throw err;
								else res.json({favs: movie.favs});
							});
						});
					}
				});
			}
		});
	}, // end fav
	popular: (req, res) => {
		const url = URI_POPULAR + process.env.TMDB_API;
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
				res.render("pages/simple-cards", {
					header: "Popular movies",
					results: movies
				});
			}
		});
	}, // end popular
	toprated: (req, res) => {
		const url = URI_TOPRATED + process.env.TMDB_API;
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
				res.render("pages/simple-cards", {
					header: "Top rated movies of all time",
					results: movies
				});
			}
		});
	}, // end top-rated
	showGenres: (req, res) => {
		Movie.find({}).distinct("genres", (err, genres) => {
			if (err) throw err;
			GENRES = genres;
			res.render("pages/filter-cards", {
				header: "Select genre(s) to filter",
				genres
			});
		});
	}, // end filter-genres GET
	filter: (req, res) => {
		const selected = Object.keys(req.body);
		Movie.find({genres: {$in: selected}}, {}, {sort: {favs: -1}}, (err, movies) => {
			if (err) throw err;

			res.render("pages/filter-cards", {
				header: "Select genre(s) to filter",
				genres: GENRES,
				results: movies
			});
		});

	}, // end filter-genres POST
	favsByYears: (req, res) => {
		let o = {};
		o.map = function () { emit(this.year, this.favs) };
		o.reduce = function (key, values) { return Array.sum(values) };
		o.out = {inline: 1};
		Movie.mapReduce(o, (err, results) => {
			if (err) throw err;

			res.render("pages/favs-by-years", {
				header: "Number of favorites by years",
				results
			});
		});
	}, // end favs by years
	genre: (req, res) => {
		Movie.find({genres: {$regex: req.params.name}}, {}, {sort: {favs: -1}}, (err, movies) => {
			if (err) throw err;

			res.render("pages/adv-cards", {
				header: req.params.name + " movies",
				results: movies
			});
		});
	}, // end genre
	year: (req, res) => {
		Movie.find({year: req.params.year}, {}, {sort: {favs: -1}}, (err, movies) => {
			if (err) throw err;

			res.render("pages/adv-cards", {
				header: "Movies from " + req.params.year,
				results: movies
			});
		});
	} // end genre
};