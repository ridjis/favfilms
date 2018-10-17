(function() {
	const $ = document.querySelector.bind(document)
	const $$ = document.querySelectorAll.bind(document)
	const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/ridjis/image/fetch'
	const pixelRatio = window.devicePixelRatio || 1.0
	const MAX_WIDTH = 780
	
	function ready(fn) {
		if (document.readyState !== 'loading') fn()
		else document.addEventListener('DOMContentLoaded', fn)
	}
	
	function lazyLoadImages() {
		let lazyImage
		const lazyImages = Array.from($$('[data-bg]'))
	
		if ('IntersectionObserver' in window) {
			let lazyImageObserver = new IntersectionObserver(entries => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						lazyImage = entry.target
						lazyImage.style.backgroundImage = `url(${formatImageSrc(lazyImage)})`
						lazyImageObserver.unobserve(lazyImage)
					}
				})
			})
	
			lazyImages.forEach(function(img) {
				lazyImageObserver.observe(img)
			})
		} else {
			lazyImages.forEach(image =>
				preloadImage(image).then(() => {
					image.style.backgroundImage = `url(${formatImageSrc(image)})`
				})
			)
		}
	
		function preloadImage(img) {
			return new Promise((resolve, reject) => {
				const image = new Image()
				image.src = img.dataset.bg
				image.onload = resolve
				image.onerror = reject
			})
		}
	
		function formatImageSrc(image) {
			const width = Math.round(image.clientWidth * pixelRatio)
			let imageParams = `w_${width},f_auto,q_auto,dpr_auto`
			if (width > MAX_WIDTH) imageParams = `f_auto,q_auto,dpr_auto`
			return `${CLOUDINARY_BASE_URL}/${imageParams}/${image.dataset.bg}`
		}
	}
	
	function putMovieToFav(id) {
		return idb.get(id).then(count => {
			if (count) return idb.set(id, count + 1)
			else return idb.set(id, 1)
		})
	}
	
	ready(() => {
		lazyLoadImages()
		// TODO provjeriti za simple-card da li se trigeruje
		$$('.card__favs').forEach(btn => {
			btn.addEventListener('click', function(event) {
				event.preventDefault()
	
				let self = event.target.closest('button')
				const movieId = self.dataset.id
				const favCounter = self.children[0]
	
				self.setAttribute('disabled', true)
				fetch(`/movies/${movieId}/fav`, { method: 'POST' })
					.catch(() => {
						if (navigator.serviceWorker && window.SyncManager) {
							navigator.serviceWorker.ready.then(registration => {
								return putMovieToFav(movieId)
									.then(() => registration.sync.register('add-fav'))
							})
						}
					})
					.then(res => res.json())
					.then(data => {
						favCounter.textContent = data.favs
						setTimeout(() => self.removeAttribute('disabled'), 250)
					}).catch(error => console.error('error happened during fav* action', error))
			})
		})
	
		const expandbtns = $$('.btn-expand')
		if (expandbtns.length > 0) {
			expandbtns.forEach(btn => {
				btn.addEventListener('click', function(event) {
					// smjestiti fav event listener i handler na dugme u modalu
					let self = event.target.closest('button')
					const movieId = self.dataset.id
					const modal = $('.modal-movie')
					const poster = modal.childNodes[1].childNodes[1]
					const details = modal.childNodes[3]
					const favs = details.childNodes[1]
					const title = details.childNodes[3]
					const year = title.childNodes[0]
					const genres = details.childNodes[5]
					const cast = details.childNodes[7]
					const plot = details.childNodes[9]
	
					fetch(`/movies/${movieId}`)
						.then(res => res.json())
						.then(movie => {
							modal.style.backgroundImage =
								"linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('https://image.tmdb.org/t/p/w1280" +
								movie.backdrop_path +
								"')"
							poster.setAttribute('src', 'https://image.tmdb.org/t/p/w500' + movie.poster_path)
							poster.setAttribute('alt', movie.title + ' poster')
							// adding data-id to button to be able to favorite
							modal.childNodes[1].childNodes[3].setAttribute('data-id', movie.id)
	
							favs.textContent = movie.favs
							title.textContent = movie.title
							year.textContent = movie.year
							genres.textContent = movie.genres
							cast.textContent = movie.cast
							plot.textContent = movie.plot
	
							$('.overlay').classList.add('is-open')
						})
				})
			})
		}
		if ($('.close-btn') != null)
			$('.close-btn').addEventListener('click', function(event) {
				$('.overlay').classList.toggle('is-open')
			});
	})
	
	if (navigator.serviceWorker) {
		window.addEventListener('load', () => {
			navigator.serviceWorker.register('/sw.js').then(reg => {
				console.log('Service Worker registered on', reg.scope)
				if (window.PushManager && window.Notification) {
					Notification.requestPermission().then(permission => {
						if (permission === 'granted') {
							reg.pushManager.getSubscription().then(existingSubscription => {
								console.log('result of getSubscription()', existingSubscription)
								if (!existingSubscription) {
									return reg.pushManager.subscribe({
										userVisibleOnly: true,
										applicationServerKey: urlBase64ToUint8Array('BBOQ8YoKUJXJh0jphl4wNRP6a0ZhRttvEu2ZatBsp3YME8HP3nl8vLkAAZ6V8l2XeBOVXnP6pgDDXow5qaJBWWE')
									}).then(subscription => {
										return fetch('/api/subscription', {
											method: 'POST',
											headers: { 'Content-Type': 'application/json' },
											body: JSON.stringify(subscription)
										}).catch(error => console.error('[POST subscription]', error))
									})
								}
							})
						}
					})
				}
			}).catch(error => console.error('Service Worker registration failed', error))
		})
	}
	function urlBase64ToUint8Array(e){const r=(e+"=".repeat((4-e.length%4)%4)).replace(/\-/g,"+").replace(/_/g,"/"),t=window.atob(r),n=new Uint8Array(t.length);for(let e=0;e<t.length;++e)n[e]=t.charCodeAt(e);return n}
	})()