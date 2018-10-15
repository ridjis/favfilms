const webpush = require('web-push')

const VAPID_KEYS = {
  publicKey: 'BBOQ8YoKUJXJh0jphl4wNRP6a0ZhRttvEu2ZatBsp3YME8HP3nl8vLkAAZ6V8l2XeBOVXnP6pgDDXow5qaJBWWE',
  privateKey: process.env.VAPID_PRIVATE_KEY
}

webpush.setVapidDetails(
	'mailto:my@email.com',
	VAPID_KEYS.publicKey,
	VAPID_KEYS.privateKey
)

const isValidSaveRequest = (req, res) => {
  if (!req.body || !req.body.endpoint) {
    res.setHeader('Content-Type', 'application/json')
    res.status(400).send(JSON.stringify({
      error: {
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint'
      }
    }))
    return false
  }
  return true
}

function wp(req, res) {
  if (!isValidSaveRequest(req, res)) {
    return
  }
  res.status(200).json({ data: { success: true } })

  return webpush.sendNotification(req.body, JSON.stringify({
		title: 'Uspjesno ste se prijavili na obavještenja. 🎉'
	}))
}

module.exports = wp
