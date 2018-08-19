const api = require('./api.controller')
let GENRES = []

module.exports = {
	test: (req, res) => {
		res.send({ ok: true })
	},
	details: async (req, res) => {
		return res.json(await api.details(req.params.movie_id))
	},
	search: async (req, res) => {
		const response = await api.search(req.body.query)
		let movies = []
		for (movie of response.data.results) {
			movies.push({
				id: movie.id,
				poster_path: movie.poster_path,
				title: movie.original_title,
				year: movie.release_date.substring(0, 4),
				plot: movie.overview
			})
		}
		return res.render('pages/simple-cards', {
			header: 'Results for ' + req.body.query,
			results: movies
		})
	}, // end search
	fav: async (req, res) => {
		const movie = await api.details(req.params.movie_id)
		if (movie)
			return res.json(await api.upadateFavs(movie))
		else
			return res.json(await api.persistNewMovie(req.params.movie_id))
	}, // end fav
	popular: async (req, res) => {
		const response = await api.popular()
		let movies = []
		for (movie of response.data.results) {
			movies.push({
				id: movie.id,
				poster_path: movie.poster_path,
				title: movie.original_title,
				year: movie.release_date.substring(0, 4),
				plot: movie.overview
			})
		}
		return res.render('pages/simple-cards', {
			header: 'Popular movies',
			results: movies
		})
	}, // end popular
	toprated: async (req, res) => {
		const response = await api.topRated()
		let movies = []
		for (movie of response.data.results) {
			movies.push({
				id: movie.id,
				poster_path: movie.poster_path,
				title: movie.original_title,
				year: movie.release_date.substring(0, 4),
				plot: movie.overview
			})
		}
		return res.render('pages/simple-cards', {
			header: 'Top rated movies of all time',
			results: movies
		})
	}, // end top-rated
	showGenres: async (req, res) => {
		const genres = await api.genres()
		GENRES = genres
		return res.render('pages/filter-cards', {
			header: 'Select genre(s) to filter',
			genres
		})
	}, // end filter-genres GET
	filter: async (req, res) => {
		const genres = Object.keys(req.body)
		return res.render('pages/filter-cards', {
			header: 'Select genre(s) to filter',
			genres: GENRES,
			results: await api.filter(genres)
		})
	}, // end filter-genres POST
	genre: async (req, res) => {
		return res.render('pages/adv-cards', {
			header: req.params.name + ' movies',
			results: await api.moviesByGenre(req.params.name)
		})
	}, // end genre
	year: async (req, res) => {
		return res.render('pages/adv-cards', {
			header: 'Movies from ' + req.params.year,
			results: await api.moviesByYear(req.params.year)
		})
	} // end genre
}
