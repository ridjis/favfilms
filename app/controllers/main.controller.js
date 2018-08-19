const api = require('./api.controller')

module.exports = {
	index: async (req, res) => {
		res.render('pages/adv-cards', {
			header: 'Most favorited movies',
			results: await api.movies()
		})
	}
}
