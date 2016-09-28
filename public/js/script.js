$(function() {
	$(".btn-add2fav").on("click", function(event) {
        event.preventDefault();
        var movieId = $(this).data("id");
        let _ = $(this);
        
        $.post("/movies/" + movieId + "/fav");
        /*.done(function(data) { 
        	//ako po završetku zahtjeva se vrati nešto pomoću res.json(); 
    		_.text("Fav'd"); setTimeout(() => { _.text("Add to favorites"); }, 2000);
        });*/
    });
});