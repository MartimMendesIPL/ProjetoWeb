$(document).ready(function () {
    var cloneOriginal = $(".card-paises").clone();
    var dados = []; // Armazena os dados de países

    function appendCountryCard(pais) { // Função para adicionar os paises
        var clonecard = cloneOriginal.clone();
        if (pais.name.common === "Nepal") {
            $(".imagem-pais", clonecard).attr("style", "height: 250px; width: 100%; object-fit: fill;");
        }

        $(".imagem-pais", clonecard).attr("src", pais.flags.svg);
        $(".nome-pais", clonecard).text(pais.name.common);
        $('#img-details', clonecard).on("click", function () {
            console.log('details.html?country=' + encodeURIComponent(pais.name.common));
            window.location.href = 'details.html?country=' + encodeURIComponent(pais.name.common); // passa o nome common do pais ataves da url do site
        });
        $(".lista-paises").append(clonecard); // Adiciona o card ao DOM
    }

    function getRandomIndex(max) { // gera um numero aleatorio
        return Math.floor(Math.random() * max);
    }
    function showCountriesFromRandomIndex() { // mostra 3 paises com base nos indices aleatorios
        $(".lista-paises").html("");
        
        const randomIndex = getRandomIndex(dados.length - 3); // -3 para garantir que haja 3 paises a serem exibidos

        const selectedCountries = dados.slice(randomIndex, randomIndex + 3); // seleciona 3 paises

        selectedCountries.forEach(appendCountryCard); // adiciona os paises
    }

    $.ajax({
        method: "GET",
        url: "https://restcountries.com/v3.1/all",
    }).done(function (response) {
        dados = response;
        showCountriesFromRandomIndex(); // Exibe 3 países a partir de um índice aleatório
        console.log(dados);
    });
});