const express = require("express"),
	router = express.Router(),
	main = require("./controllers/main.controller"),
	movies = require("./controllers/movies.controller");

router.get("/", main.index);
router.post("/movies/search", movies.search);

module.exports = router;