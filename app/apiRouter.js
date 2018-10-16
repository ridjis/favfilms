const router = require('express').Router()
const api = require('./controllers/api.controller')

router.get('/movies', api.movies)
router.get('/movies/popular', api.popular)
router.get('/movies/top-rated', api.topRated)
router.get('/movies/:movie_id', api.details)

router.post('/movies/search', api.search)
router.post('/movies/filter', api.filter)
router.post('/movies/:movie_id/fav', api.favorite)

//router.get('/movies/filter', api.showGenres)
router.get('/genres', api.genres)
router.get('/genre/:name', api.genre)
router.get('/year/:year', api.year)

router.post('/subscription', api.subscribe)
router.get('/weekly-push', api.weeklyRecommendation)

module.exports = router
