const router = require('express').Router()
const api = require('./controllers/api.controller')

router.get('/movies', api.movies)
router.get('/movies/:movie_id', api.details)
router.get('/movies/popular', api.popular)
router.get('/movies/top-rated', api.topRated)
//router.get('/movies/filter', api.showGenres)

//router.post('/movies/filter', api.filter)
router.post('/movies/search', api.search)
router.post('/movies/:movie_id/fav', api.upadateFavs)

//router.get('/genre/:name', api.genre)
//router.get('/year/:year', api.year)

module.exports = router
