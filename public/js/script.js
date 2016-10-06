$(function() {
	$(".btn-add2fav").on("click", function(event) {
        event.preventDefault();

        const movieId = $(this).data("id");
        const btn = $(this);
        const favcounter = btn.parent().children(".card-land-block").children(".card-land-favs").get(0);

        btn.prop("disabled", true).text("Fav'd");
        $.post("/movies/" + movieId + "/fav", (data) => {
            favcounter.innerText = data.favs;
            setTimeout(() => { btn.prop("disabled", false).text("Add to favorites") }, 500);
        });
    });
    $(".btn-expand").on("click", function(event) {
        event.preventDefault();

        const movieId = $(this).data("id");
    });
});