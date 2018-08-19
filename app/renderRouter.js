const router = require('express').Router()
const main = require('./controllers/main.controller')
const movies = require('./controllers/movies.controller')

router.get('/', main.index)

router.get('/movies/test', movies.test)
router.get('/movies/popular', movies.popular)
router.get('/movies/top-rated', movies.toprated)
router.get('/movies/filter', movies.showGenres)
router.get('/movies/:movie_id', movies.details)

router.post('/movies/filter', movies.filter)
router.post('/movies/search', movies.search)
router.post('/movies/:movie_id/fav', movies.fav)

router.get('/genre/:name', movies.genre)
router.get('/year/:year', movies.year)

module.exports = router
