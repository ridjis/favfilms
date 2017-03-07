const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const movieSchema = new Schema({
	id: {type: Number, unique: true},
	poster_path: String,
	backdrop_path: String,
	title: String,
	year: Number,
	plot: String,
	genres: [String],
	cast: [String],
	favs: {type: Number, default: 1},
	timestamp: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Movie", movieSchema);