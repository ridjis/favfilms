const axios = require('axios')
const Movie = require('../models/movie')

const URI_POPULAR = 'https://api.themoviedb.org/3/movie/popular?'
const URI_TOPRATED = 'https://api.themoviedb.org/3/movie/top_rated?'
const URI_QUERY = 'https://api.themoviedb.org/3/search/movie?query='
const URI_DETAILS = 'https://api.themoviedb.org/3/movie/'
const API_KEY = process.env.TMDB_API

const api = {
	movies() {
		return Movie.find().sort({ favs: -1 })
	},
	details(id) {
		return Movie.findOne({ id })
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
		return axios(`${URI_POPULAR}${process.env.TMDB_API}`)
	},
	topRated() {
		return axios(`${URI_TOPRATED}${process.env.TMDB_API}`)
	},
	moviesByGenre(genre) {
		return Movie.find({ genres: { $regex: genre } }).sort({ favs: -1 })
	},
	moviesByYear(year) {
		return Movie.find({ year }).sort({ favs: -1 })
	},
	getMovieFromTMDB(id) {
		return axios(`${URI_DETAILS}${id}?${API_KEY}`)
	},
	getCreditsForMovieFromTMDB(id) {
		return axios(`${URI_DETAILS}${id}/credits?${API_KEY}`)
	},
	async upadateFavs(movie) {
		movie.favs = movie.favs + 1
		movie.timestamp = new Date()
		const updated = await movie.save()

		return { favs: updated.favs }
	},
	async persistNewMovie(id) {
		const response = await api.getMovieFromTMDB(id)
		const movie = {
			id: response.data.id,
			poster_path: response.data.poster_path,
			backdrop_path: response.data.backdrop_path,
			title: response.data.original_title,
			year: response.data.release_date.substring(0, 4),
			plot: response.data.overview,
			genres: response.data.genres.map(genre => genre.name.replace(/\s+/g, '-'))
		}

		const credits = await api.getCreditsForMovieFromTMDB(id)
		movie.cast = credits.data.cast.map(actor => actor.name).slice(0, 6)

		const persisted = await (new Movie(movie).save())

		return { favs: persisted.favs }
	}
}

module.exports = api
