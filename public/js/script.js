$(function() {
	$(".btn-add2fav").click(function(event) {
        event.preventDefault();

        const self = event.target;
        const movieId = self.dataset.id;
        const btn = $(this);
        const favcounter = self.parentElement.childNodes[3].childNodes[1];

        self.setAttribute("disabled", true);
        self.innerText = "Fav'd";
        $.post("/movies/" + movieId + "/fav", (data) => {
            favcounter.innerText = data.favs;
            setTimeout(() => { self.removeAttribute("disabled"); self.innerText = "Add to favorites"; }, 500);
        });
    });
    $(".btn-fav").click(function(event) {
        event.preventDefault();

        const self = event.target;
        const movieId = self.dataset.id;
        const favcounter = self.parentElement.parentElement.childNodes[3].childNodes[1];
        const favCounterCard = document.querySelector(".card-land [data-id='" + movieId + "']").parentElement.childNodes[3].childNodes[1];

        self.setAttribute("disabled", true);
        self.innerText = "Fav'd";
        $.post("/movies/" + movieId + "/fav", (data) => {
            favcounter.innerText = data.favs;
            favCounterCard.innerText = data.favs;
            setTimeout(() => { self.removeAttribute("disabled"); self.innerText = "Add to favorites"; }, 500);
        });
    });

    $(".btn-expand").click(function(event) {
        $('.overlay').addClass('is-open');
        const movieId = $(this).data("id");

        const modal = $(".modal-movie");
        const poster = modal.children("div.img-left").children("img.poster");
        const details = modal.children(".details-block");
        const favs = details.children(".favs");
        const title = details.children(".title");
        const year = details.children("small.year");
        const genres = details.children(".genres");
        const cast = details.children(".cast");
        const plot = details.children(".plot");

        $.post("/movies/" + movieId, (movie) => {
            modal.css("background-image", "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url('https://image.tmdb.org/t/p/w1280"+ movie.backdrop_path +"')");
            poster.attr("src", "https://image.tmdb.org/t/p/w500" + movie.poster_path);
            poster.attr("alt", movie.title + " poster");
            modal.children("div.img-left").children("button.btn-fav").attr("data-id", movie.id);

            favs.text(movie.favs);
            title.text(movie.title);
            year.text(movie.year);
            genres.text(movie.genres);
            cast.text(movie.cast);
            plot.text(movie.plot);
        });
    });

    $(".close-btn").click(function(event) {
        $('.overlay').removeClass('is-open')
    });
});