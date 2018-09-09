const $ = document.querySelector.bind(document)

function ready(fn) {
	if (document.readyState !== 'loading') fn()
	else document.addEventListener('DOMContentLoaded', fn)
}

function lazyLoadImages() {
	let lazyImage
	const lazyImages = [].slice.call(document.querySelectorAll('img.lazy'))

	if ('IntersectionObserver' in window) {
		let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					lazyImage = entry.target
					lazyImage.src = lazyImage.dataset.src
					//lazyImage.srcset = lazyImage.dataset.srcset
					lazyImage.classList.remove('lazy')
					lazyImageObserver.unobserve(lazyImage)
				}
			})
		})

		lazyImages.forEach(function(lazyImage) {
			lazyImageObserver.observe(lazyImage)
		})
	} else {
		lazyImages.forEach(image =>
			preloadImage(image).then(() => {
				image.src = image.dataset.src
				image.classList.remove('lazy')
			})
		)
	}

	function preloadImage(img) {
		return new Promise((resolve, reject) => {
			const image = new Image()
			image.src = img.dataset.src
			image.onload = resolve
			image.onerror = reject
		})
	}
}

ready(() => {
	lazyLoadImages()

	document.querySelectorAll('.btn-add2fav').forEach(btn => {
		btn.addEventListener('click', function(event) {
			event.preventDefault()

			const self = event.target
			const movieId = self.dataset.id
			const favcounter = self.parentElement.parentElement.childNodes[1].childNodes[1]

			self.setAttribute('disabled', true)
			self.textContent = "Fav'd"
			fetch(`/movies/${movieId}/fav`, { method: 'POST' })
				.then(res => res.json())
				.then(data => {
					favcounter.textContent = data.favs
					setTimeout(() => {
						self.removeAttribute('disabled')
						self.textContent = 'Add as favorite'
					}, 500)
				})
		})
	})

	const favbtns = document.querySelectorAll('.btn-fav')
	if (favbtns.length > 0)
		favbtns.forEach(btn => {
			btn.addEventListener('click', function(event) {
				event.preventDefault()

				const self = event.target
				const movieId = self.dataset.id
				const favcounter = self.parentElement.parentElement.childNodes[3].childNodes[1]
				const favCounterCard = $(".card-land [data-id='" + movieId + "']").parentElement
					.childNodes[3].childNodes[1]

				self.setAttribute('disabled', true)
				self.textContent = "Fav'd"
				fetch(`/movies/${movieId}/fav`, { method: 'POST' })
					.then(res => res.json())
					.then(data => {
						favcounter.textContent = data.favs
						favCounterCard.textContent = data.favs
						setTimeout(() => {
							self.removeAttribute('disabled')
							self.textContent = 'Add as favorite'
						}, 500)
					})
			})
		})

	const expandbtns = document.querySelectorAll('.btn-expand')
	if (expandbtns.length > 0) {
		expandbtns.forEach(btn => {
			btn.addEventListener('click', function(event) {
				// if middle of button is clicked, event.target isn't button but icon
				let self = event.target

				if (self.localName === 'svg') self = self.parentElement
				else if (self.localName === 'path') self = self.parentElement.parentElement

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
		})

	// toggle navbar
	const menuBtn = $('button.navbar-toggler')
	menuBtn.addEventListener('click', function(event) {
		navbarSupportedContent.classList.toggle('show')
	})
})
