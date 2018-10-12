const helper = require('./helper.controller')
let GENRES = []

module.exports = {
	test: (req, res) => {
		res.send({ ok: true })
	},
	details: async (req, res) => {
		return res.json(await helper.details(req.params.movie_id))
	},
	search: async (req, res) => {
		const response = await helper.search(req.body.query)
		let movies = []
		for (movie of response.data.results) {
			movies.push({
				id: movie.id,
				poster_path: movie.poster_path,
				backdrop_path: movie.backdrop_path,
				vote_average: movie.vote_average,
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
	fav: async ({ params, query }, res) => {
		const movie = await helper.details(params.movie_id)
		if (movie) {
			return res.json(await helper.upadateFavs(movie, query.increment_by))
		} else
			return res.json(await helper.persistNewMovie(params.movie_id))
	}, // end fav
	popular: async (req, res) => {
		const response = await helper.popular()
		let movies = []
		for (movie of response) {
			movies.push({
				id: movie.id,
				backdrop_path: movie.backdrop_path,
				vote_average: movie.vote_average,
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
		const response = await helper.topRated()
		let movies = []
		for (movie of response) {
			movies.push({
				id: movie.id,
				poster_path: movie.poster_path,
				backdrop_path: movie.backdrop_path,
				vote_average: movie.vote_average,
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
		const genres = await helper.genres()
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
			results: await helper.filter(genres)
		})
	}, // end filter-genres POST
	genre: async (req, res) => {
		return res.render('pages/adv-cards', {
			header: req.params.name + ' movies',
			results: await helper.moviesByGenre(req.params.name)
		})
	}, // end genre
	year: async (req, res) => {
		return res.render('pages/adv-cards', {
			header: 'Movies from ' + req.params.year,
			results: await helper.moviesByYear(req.params.year)
		})
	} // end genre
}
