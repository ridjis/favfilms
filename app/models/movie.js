const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.Promise = global.Promise

const movieSchema = new Schema({
	id: { type: Number, unique: true },
	poster_path: String,
	backdrop_path: String,
	title: String,
	year: Number,
	plot: String,
	vote_average: Number,
	imdb_id: String,
	genres: [String],
	cast: [String],
	favs: { type: Number, default: 1 },
	timestamp: { type: Date, default: Date.now }
})

movieSchema.post('find', function(result) {
	result.map(result => result.genres_min = result.genres.slice(0, 2))
})

module.exports = mongoose.model('Movie', movieSchema)
