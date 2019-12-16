$(document).ready(function() {
    
    $("#cerca-button").click(function(){
        var input_utente = $("#ricerca-utente").val();
        if (input_utente.length != 0){
            cerca_chiama_cicla_appendi();
        }
    })
    $("#ricerca-utente").keypress(function(event){
        // stesso procedimento ma per il tasto invio,l evento è collegato appunto al tasto 13
        if(event.which == 13){
            var input_utente = $("#ricerca-utente").val();
            if (input_utente.length != 0){
                cerca_chiama_cicla_appendi();
            }
        }
    })
    function cerca_chiama_cicla_appendi(){
        var input_utente = $("#ricerca-utente").val();
        var api_url_base = "https://api.themoviedb.org/3/";
        $("main ul").html("");
        $.ajax({
            "url": api_url_base + "search/movie",
            "data":{
                "api_key": "413d7cf422920e39fd259b5efffad54a",
                "query": input_utente,
                "language": "it-IT"
            },
            "method": "get",
            "success": function(data) {
                console.log(data);
                var film = data.results;
                for (var i = 0; i < film.length; i++) {
                    var film_corrente = film[i];
                    var titolo = film_corrente.title;
                    $("main ul").append("<li>" + "Titolo: " + titolo + "</li>");
                    var titolo_originale = film_corrente.original_title;
                    $("main ul").append("<li>" + "Titolo originale: " + titolo_originale + "</li>");
                    var lingua = film_corrente.original_language;
                    $("main ul").append("<li>" + "Lingua: "  + lingua + "</li>");
                    var voto = film_corrente.vote_average;
                    $("main ul").append("<li>" + "Voto: " + voto + "</li>");
                    $("main ul").append("<br>");
                };
            },
            "error": function(){
                alert("errore");
            }
        });
    }

});
