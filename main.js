$(document).ready(function() {
    // 1- recupero il codice html del template
    var template_html = $('#informazioni_film_template').html();
    // 2- do in pasto a handlebars il codice html
    // N.B.: la funzione "Handlebars.compile" restituisce una *funzione* da utilizzare per andare a usare il template
    var template_function = Handlebars.compile(template_html);
    // creo variabili globali per le informazioni che serviranno nella chiamata ajax
    var api_url_base = "https://api.themoviedb.org/3/";
    var api_key = "413d7cf422920e39fd259b5efffad54a";

    $("#cerca-button").click(function(){
        var input_utente = $("#ricerca-utente").val();
        if (input_utente.length != 0){
            nuova_ricerca();
        }
    });
    $("#ricerca-utente").keypress(function(event){
        // stesso procedimento ma per il tasto invio,l evento è collegato appunto al tasto 13
        if(event.which == 13){
            var input_utente = $("#ricerca-utente").val();
            if (input_utente.length != 0){
                nuova_ricerca();
            }
        }
    });
    // funzione che gestisce ogni ricerca
    function nuova_ricerca(){
        var input_utente = $("#ricerca-utente").val();
        // resetto l input
        $("#ricerca-utente").val("");
        // resetto il contenuto della pagina
        $("main").html("");
        // può partire la chiamata api attraverso la funzione
        chiamata_api(input_utente);
    }
    // funzione per fare una chiamara api con query fornita in input
    function chiamata_api(query_ricerca){
        $.ajax({
            "url": api_url_base + "search/movie",
            "data":{
                "api_key": api_key,
                "query": query_ricerca,
                "language": "it-IT"
            },
            "method": "get",
            "success": function(data) {
                var film = data.results;
                // chiamo funzione per stampare i risultati
                cicla_stampa(film);
            },
            "error": function(){
                alert("errore");
            }
        });
    }
    function cicla_stampa(risultati){
        for (var i = 0; i < risultati.length; i++) {
            var film_corrente = risultati[i];
            var titolo = film_corrente.title;
            var titolo_originale = film_corrente.original_title;
            var lingua = film_corrente.original_language;
            var voto = film_corrente.vote_average;
            var voto_stelle = Math.round(voto /2);

            var bandiere = {
                fr: '<img src="https://www.countryflags.io/fr/flat/24.png" alt="">',
                it: '<img src="https://www.countryflags.io/it/flat/24.png" alt="">',
                ja: '<img src="https://www.countryflags.io/jp/flat/24.png" alt="">',
                en: '<img src="https://www.countryflags.io/us/flat/24.png" alt="">',
                ge: '<img src="https://www.countryflags.io/ge/flat/24.png" alt="">'
            };
            var bandiera_finale;
            for (var bandiera in bandiere) {
                if (bandiera == lingua) {
                    bandiera_finale = bandiere[bandiera];
                }
            }

            var stella_vuota = '<i class="far fa-star"></i>';
            var stella_piena = '<i class="fas fa-star"></i>';
            var stelle;
            for (var i = 1; i <= 5; i++) {
                // console.log(i);
                    if (i <= voto_stelle ) {
                         stelle += stella_piena;
                    } else {
                        stelle += stella_vuota;
                    }
            };
            var informazioni = {
                titolo: titolo,
                originale: titolo_originale,
                lingua: bandiera_finale,
                voto: stelle
                }
            console.log(informazioni);
            // creo il template
            var html = template_function(informazioni);
            // lo appendo al contenitore
            $("main").append(html);
        };
    }


});
