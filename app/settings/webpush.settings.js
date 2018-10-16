const webpush = require('web-push')
const helper = require('../controllers/helper.controller')
const Subscription = require('../models/subscription')
const { publicKey, privateKey } = require('./vapid.keys')

console.log('in wp')

webpush.setVapidDetails('mailto:my@email.com', publicKey, privateKey)

const isValidSaveRequest = (req, res) => {
  if (!req.body || !req.body.endpoint) {
    res.status(400).json({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint'
      }
    })
    return false
  }
  subscription = req.body
  return true
}

async function saveSubscriptionAndNotify(req, res) {
  console.log('saveSubscriptionAndNotify() called')
  if (!isValidSaveRequest(req, res)) {
		return
  }
  
	const subscription = await new Subscription({
    id: req.body.keys.auth,
		subscription: JSON.stringify(req.body)
	}).save()

  res.status(200).json({ data: { success: true, subscription } })

  return webpush.sendNotification(req.body, JSON.stringify({
		title: 'You\'ve successfully subscribed to notifications. 🎉'
	}))
}

async function sendWeeklyNotifications(req, res) {
  console.log('sendWeeklyNotifications() called')

  const subscriptions = await Subscription.find()
  const movie = await helper.random()

  const movieRecommendation = JSON.stringify({
    title: `🎬 ${movie.title} (${movie.year})`,
    body: 'is recommendation for this week. Enjoy. 🍿',
    image: movie.backdrop_path
  })
  Promise.all(subscriptions.map(s =>
    webpush.sendNotification(JSON.parse(s.subscription), movieRecommendation)
  ))

  return res.status(200).json({ message: 'Recommendation sent' })
}

module.exports = {
  saveSubscriptionAndNotify,
  sendWeeklyNotifications
}
