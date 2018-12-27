const helper = require('./helper.controller')

const api = {
	async movies(req, res) {
		try {
			res.status(200).json({
				success: true,
				data: await helper.movies()
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				data: error.message
			})
		}
	},
	async details(req, res) {
		try {
			res.status(200).json({
				success: true,
				data: await helper.details(req.params.movie_id)
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				data: error.message
			})
		}
	},
	async search(req, res) {
		try {
			res.status(200).json({
				success: true,
				data: await helper.search(req.body.query)
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				data: error.message
			})
		}
	},
	async genre(req, res) {
		try {
			res.status(200).json({
				success: true,
				data: await helper.moviesByGenre(req.params.name)
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				data: error.message
			})
		}
	},
	async genres(req, res) {
		try {
			res.status(200).json({
				success: true,
				data: await helper.genres()
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				data: error.message
			})
		}
	},
	async filter(req, res) {
		const selectedGenres = Object.keys(req.body)
		try {
			res.status(200).json({
				success: true,
				data: await helper.genres(selectedGenres)
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				data: error.message
			})
		}
	},
	async popular(req, res) {
		try {
			res.status(200).json({
				success: true,
				data: await helper.popular()
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				data: error.message
			})
		}
	},
	async topRated(req, res) {
		try {
			res.status(200).json({
				success: true,
				data: await helper.topRated()
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				data: error.message
			})
		}
	},
	async year(req, res) {
		try {
			res.status(200).json({
				success: true,
				data: await helper.moviesByYear(req.params.year)
			})
		} catch (error) {
			res.status(500).json({
				success: false,
				data: error.message
			})
		}
	},
	async favorite(req, res) {
		try {
			const movie = await helper.details(req.params.movie_id)
			
			if (movie) {
				res.status(200).json({
					success: true,
					data: await helper.upadateFavs(movie)
				})
			} else {
				res.status(200).json({
					success: true,
					data: await helper.persistNewMovie(req.params.movie_id)
				})
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				data: error.message
			})
		}
	}
}

module.exports = api
