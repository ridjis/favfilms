const axios = require('axios')
const Movie = require('../models/movie')

const URI_POPULAR = 'https://api.themoviedb.org/3/movie/popular?'
const URI_TOPRATED = 'https://api.themoviedb.org/3/movie/top_rated?'
const URI_QUERY = 'https://api.themoviedb.org/3/search/movie?query='
const URI_DETAILS = 'https://api.themoviedb.org/3/movie/'
const API_KEY = process.env.TMDB_API

const helper = {
	movies() {
		return Movie.find().sort({ favs: -1 })
	},
	details(id) {
		return Movie.findOne({ id })
	},
	random() {
		return Movie.count().then(count => {
			const randomNumber = Math.floor((Math.random() * count) + 1)
			return Movie.findOne().skip(randomNumber)
		})
	},
	search(query) {
		return axios(`${URI_QUERY}${query}&${API_KEY}`)
	},
	genres() {
		return Movie.find().distinct('genres')
	},
	filter(genres) {
		return Movie.find({ genres: { $in: genres } }).sort({ favs: -1 })
	},
	popular() {
		return axios(`${URI_POPULAR}${process.env.TMDB_API}`).then(response => response.data.results)
	},
	topRated() {
		return axios(`${URI_TOPRATED}${process.env.TMDB_API}`).then(response => response.data.results)
	},
	moviesByGenre(genre) {
		return Movie.find({ genres: { $regex: genre } }).sort({ favs: -1 })
	},
	moviesByYear(year) {
		return Movie.find({ year }).sort({ favs: -1 })
	},
	getMovieFromTMDB(id) {
		return axios(`${URI_DETAILS}${id}?${API_KEY}`).then(response => response.data)
	},
	getCreditsForMovieFromTMDB(id) {
		return axios(`${URI_DETAILS}${id}/credits?${API_KEY}`).then(response => response.data)
	},
	async upadateFavs(movie, incrementBy = 1) {
		movie.favs = movie.favs + Number.parseInt(incrementBy)
		movie.timestamp = new Date()
		const updated = await movie.save()

		return { favs: updated.favs }
	},
	async persistNewMovie(id) {
		const response = await helper.getMovieFromTMDB(id)
		const movie = {
			id: response.id,
			poster_path: response.poster_path,
			backdrop_path: response.backdrop_path,
			title: response.original_title,
			year: response.release_date.substring(0, 4),
			plot: response.overview,
			vote_average: response.vote_average,
			imdb_id: response.imdb_id,
			genres: response.genres.map(genre =>
				genre.name.replace(/\s+/g, '-').replace(/Science-Fiction/gi, 'Sci-Fi')
			)
		}

		const credits = await helper.getCreditsForMovieFromTMDB(id)
		movie.cast = credits.cast.map(actor => actor.name).slice(0, 6)

		const persisted = await new Movie(movie).save()

		return { favs: persisted.favs }
	}
}

module.exports = helper
