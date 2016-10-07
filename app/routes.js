const express = require("express"),
	router = express.Router(),
	main = require("./controllers/main.controller"),
	movies = require("./controllers/movies.controller");

router.get("/", main.index);
router.get("/movies/fix", movies.fix);
router.get("/movies/popular", movies.popular);
router.get("/movies/top-rated", movies.toprated);
router.get("/movies/filter", movies.showGenres);
router.post("/movies/filter", movies.filter);
router.post("/movies/search", movies.search);
router.post("/movies/:movie_id/fav", movies.fav);
router.post("/movies/:movie_id", movies.details);
router.get("/genre/:name", movies.genre);
router.get("/year/:year", movies.year);
//router.get("/movies/favsbyyears", movies.favsByYears);

module.exports = router;