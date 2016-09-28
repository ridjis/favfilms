const mongoose = require("mongoose"),
	  Schema = mongoose.Schema;

const movieSchema = new Schema({
	id: {type: Number, unique: true},
	poster_path: String,
	title: String,
	year: Number,
	plot: String,
	genres: [String],
	cast: [String],
	favs: {type: Number, default: 1}
});

module.exports = mongoose.model("Movie", movieSchema);