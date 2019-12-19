$(document).ready(function() {
    // 1- recupero il codice html del template
    var template_html = $('#informazioni_film_template').html();
    // 2- do in pasto a handlebars il codice html
    // N.B.: la funzione "Handlebars.compile" restituisce una *funzione* da utilizzare per andare a usare il template
    var template_function = Handlebars.compile(template_html);
    // creo variabili globali per le informazioni che serviranno nella chiamata ajax
    var api_url_base = "https://api.themoviedb.org/3/";
    var api_key = "413d7cf422920e39fd259b5efffad54a";
    var url_base_immagini = "https://image.tmdb.org/t/p/";
    var size_copertine = "w185";

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
        $("#risultati-film, #risultati-serie").html("");
        // può partire la chiamata api attraverso la funzione
        chiamata_api_serie(input_utente);
        chiamata_api_film(input_utente);
    }
    // funzioni per fare una chiamara api con query fornita in input, una per i film l altra per le serie
    function chiamata_api_film(query_ricerca){
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
                $("#sezione-film").addClass("visibile");
            },
            "error": function(){
                alert("errore");
            }
        });
    }
    function chiamata_api_serie(query_ricerca){
        $.ajax({
            "url": api_url_base + "search/tv",
            "data":{
                "api_key": api_key,
                "query": query_ricerca,
                "language": "it-IT"
            },
            "method": "get",
            "success": function(data) {
                var serie = data.results;
                // chiamo funzione per stampare i risultati
                cicla_stampa(serie);
                $("#sezione-serie").addClass("visibile");
            },
            "error": function(){
                alert("errore");
            }
        });
    }
    function cicla_stampa(risultati){
        for (var i = 0; i < risultati.length; i++) {
            var film_corrente = risultati[i];
            console.log(film_corrente);
            if (film_corrente.hasOwnProperty('title')) {
                var titolo = film_corrente.title;
                var tipo = "film";
                var contenitore = $("#risultati-film");
            } else {
                var titolo = film_corrente.name;
                var tipo = "serie tv";
                var contenitore = $("#risultati-serie");
            }
            if (film_corrente.hasOwnProperty('original_title')) {
                var titolo_originale = film_corrente.original_title;
            } else {
                var titolo_originale = film_corrente.original_name;
            }
            var lingua = film_corrente.original_language;
            var voto = film_corrente.vote_average;
            var voto_stelle = Math.round(voto /2);
            var url_copertina = film_corrente.poster_path;
            if (url_copertina != null) {
                var url_copertina_finale = url_base_immagini + size_copertine + url_copertina;
                var descrizione = film_corrente.overview;
            } else {
                var url_copertina_finale = "https://www.rodmanbikes.store/img/p/it-default-big_default.jpg";
            }

            var informazioni = {
                titolo: titolo,
                originale: titolo_originale,
                lingua: assegna_bandiera(lingua),
                voto: crea_stelline(voto_stelle),
                type: tipo,
                immagine_copertina: url_copertina_finale,
                descrizione: descrizione
                }
            // creo il template
            var html = template_function(informazioni);
            // lo appendo al contenitore
            $(contenitore).append(html);
        };
    }
    // funzione per creare le stelline
    function crea_stelline(rate){
        // creo variabili per le stelle vuote e piene contenente proprio il codice html
        var stella_vuota = '<i class="far fa-star"></i>';
        var stella_piena = '<i class="fas fa-star"></i>';
        // variabile vuota da riempire durante il ciclo con stelle piene o vuote a seconda della variabile "a" in quel momento, in riferimento al voto stelle in quel momento
        var stelle = "";
        // importante cambiare il nome della variabile altrimenti fa contrasto con la i del ciclo in cui è contenuto questo
        for (var a = 1; a < 6; a++) {
                if ( a<= rate ) {
                     stelle += stella_piena;
                } else {
                    stelle += stella_vuota;
                }
        };
        return stelle
    }
    // funzione per assegnare la bandiera corrispondente alla lingua originale, se presente nel oggetto bandiere creato con chiavi nominate come le lingue possibili e avente per valore gli html con src esterno
    function assegna_bandiera(lingua_film){
        // creo un insieme di bandiere con chiavi avente lo stesso nome del valore della proprietà original language
        var bandiere = {
            fr: '<img src="https://www.countryflags.io/fr/flat/24.png" alt="">',
            it: '<img src="https://www.countryflags.io/it/flat/24.png" alt="">',
            ja: '<img src="https://www.countryflags.io/jp/flat/24.png" alt="">',
            en: '<img src="https://www.countryflags.io/us/flat/24.png" alt="">',
            ge: '<img src="https://www.countryflags.io/ge/flat/24.png" alt="">'
        };
        // metodo con utilizzo di hasOwnProperty, più comodo e pulito
        var bandiera_finale;
        if (bandiere.hasOwnProperty(lingua_film)) {
            // lingua non esiste come chiave dentro a bandiere quindi non posso usare la dot notation, uso le quadre
            bandiera_finale = bandiere[lingua_film];
        } else {
            bandiera_finale = lingua_film;
        }
        //tentativo delle bandiere usando un ciclo for in(funzionante)

        // valuto se la chiave in quel momento è presente nella lista bandiere, se si la variabile creata assume quel valore
        // var bandiera_finale;
        // for (var bandiera in bandiere) {
        //     if (bandiera == lingua_film) {
        //         bandiera_finale = bandiere[bandiera];
        //     }
        // }
        // // nel caso in cui non ci sia in lista prende il valore della lingua in modo che ci sia comunque un risultato in pagina
        // if (!bandiera_finale) {
        //     bandiera_finale = lingua_film;
        // }
        return bandiera_finale
    }


});
