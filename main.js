$(document).ready(function() {
    // 1- recupero il codice html del template
    var template_html = $('#informazioni_film_template').html();
    // 2- do in pasto a handlebars il codice html
    // N.B.: la funzione "Handlebars.compile" restituisce una *funzione* da utilizzare per andare a usare il template
    var template_function = Handlebars.compile(template_html);

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
        $("main").html("");
        $.ajax({
            "url": api_url_base + "search/movie",
            "data":{
                "api_key": "413d7cf422920e39fd259b5efffad54a",
                "query": input_utente,
                "language": "it-IT"
            },
            "method": "get",
            "success": function(data) {
                var film = data.results;
                for (var i = 0; i < film.length; i++) {
                    var film_corrente = film[i];
                    var titolo = film_corrente.title;
                    var titolo_originale = film_corrente.original_title;
                    var lingua = film_corrente.original_language;
                    var voto = film_corrente.vote_average;
                    var voto_stelle = Math.round(voto /2);
                    var informazioni = {
                        titolo: titolo,
                        originale: titolo_originale,
                        lingua: lingua,
                        voto: voto_stelle
                    };
                    // creo il template
                    var html = template_function(informazioni);
                    // lo appendo al contenitore
                    $("main").append(html);

                };
            },
            "error": function(){
                alert("errore");
            }
        });
    }

});
