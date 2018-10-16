const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise

const subscriptionSchema = new Schema({
	id: { type: String, unique: true },
	subscription: String,
	timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Subscription', subscriptionSchema)
