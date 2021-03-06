const STATIC_CACHE_NAME = 'ff-static-v4'
const IMAGES_CACHE_NAME = 'ff-images'
const ALL_CACHES = [STATIC_CACHE_NAME, IMAGES_CACHE_NAME]

const STATIC_ASSET = [
	'/',
	'/?homescreen=true',
	'/manifest.json',
	'/favicon.ico',
	'/css/style.min.css',
	'/js/idb.js',
	'/js/script.js',
	'/fonts/nunito-regular.woff',
	'/fonts/nunito-regular.woff2',
	'/fonts/nunito-bold.woff',
	'/fonts/nunito-bold.woff2',
	'/fonts/nunito.css',
	'/img/favfilms-logo.png',
	'/img/poster-missing.png',
	'/img/backdrop-missing.png',
	'/img/backdrop-loading.png',
	'/img/backdrop-offline.png'
]

self.addEventListener('install', event => {
	console.log('[install] installing')
	self.importScripts('/js/idb.js')

	return event.waitUntil(
		caches
			.open(STATIC_CACHE_NAME)
			.then(cache => cache.addAll(STATIC_ASSET))
			.then(() => self.skipWaiting())
			.catch(error => console.error('[install] greška u install događaju', error))
	)
})

self.addEventListener('activate', event => {
	console.log('[activate] cleaning cache')
	return event.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(cache => cache.startsWith('ff-') && !ALL_CACHES.includes(cache))
				.map(cache => caches.delete(cache))
			)
		})
	)
})

self.addEventListener('fetch', event => {
	const requestURL = new URL(event.request.url)

	if (requestURL.pathname === '/') updateIndexPage()

	if (/^(\/t\/)|(\/ridjis\/)/.test(requestURL.pathname))
		if (/(\/)$/.test(event.request.referrer))
			return event.respondWith(servePhoto(event.request))

	return event.respondWith(
		caches.match(event.request).then(response => {
			return (response || fetch(event.request).then(networkResponse => {
				// ako je fejvovan film, azuriraj index.html zbog broja fejvova
				if (/(\/fav)$/.test(event.request.url)) updateIndexPage()

				return networkResponse
			}))
		})
	)
})

self.addEventListener('sync', event => {
	console.log('[sync] syncing', event.tag)
	return event.waitUntil(
		idb.keys().then(movieIds => {
			console.log('[sync] got movies', movieIds)
			return Promise.all(movieIds.map(movieId => {
				console.log('[sync] attempting fetch', movieId)
				return idb.get(movieId).then(count => {
					const incrementBy = (count > 1) ? `?increment_by=${count}` : ''
					fetch(`/movies/${movieId}/fav${incrementBy}`, { method: 'POST' })
						.then(() => {
							console.log('[sync] sent to server')
							return idb.del(movieId)
						}).then(updateIndexPage)
				})
			}))
		})
	)
})

self.addEventListener('push', event => {
	const { title, body, image } = event.data.json()
	console.log('[push]', event.data.json())
	return event.waitUntil(
		self.registration.showNotification(title, {
			icon: '/img/icons/icon-256.png',
			badge: '/img/icons/icon-96.png',
			body,
			image: `https://image.tmdb.org/t/p/w300${image}`
		})
	)
})

function servePhoto(request) {
	//console.log('in servePhoto()')
	return caches.open(IMAGES_CACHE_NAME).then(cache => {
		return cache.match(request.url).then(response => {
			if (response) return response

			return fetch(request.url)
				.then(networkResponse => {
					cache.put(request.url, networkResponse.clone())
					return networkResponse
				})
				.catch(() => {
					if (request.url.match(/\.(jpe?g|png|svg)$/)) {
						return caches
							.open(STATIC_CACHE_NAME)
							.then(cache => cache.match('/img/backdrop-offline.png'))
					}
				})
		})
	})
}

// FIX - avoid cached version of index.html
function updateIndexPage() {
	return caches
		.open(STATIC_CACHE_NAME)
		.then(cache => {
			return fetch('/').then(response => {
				cache.put('/?homescreen=true', response.clone())
				return cache.put('/', response)
			})
		}).catch(error => console.log('[fetch] greška pri fetchu u updateIndexPage()', error))
}
