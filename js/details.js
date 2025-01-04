$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search); // puxa o nome que foi enviado da pagina paises
    var countryName = urlParams.get('country'); // Obtém o parâmetro 'country'
    
    console.log(countryName);
    if (countryName) {
        $.ajax({
            method: "GET",
            url: `https://restcountries.com/v3.1/name/${countryName}?fullText=true`, // pesquisa o nome do pais por completo para evitar conflitos
        }).done(function (dados) {
            const pais = dados[0]; // Considerando que há apenas 1 resultado

            $("#countryFlag").attr("src", pais.flags.svg);
            $("#countryName").text(pais.name.common);
            $("#countryLoc").attr("href", pais.maps.googleMaps);

            $("#countryCapitalName").text(pais.capital ? pais.capital[0] : "Não disponível");
            $("#countryNameOficial").text(pais.name.official);

            const moedas = pais.currencies;
            const moedasInfo = Object.values(moedas).map(moeda => `${moeda.symbol} ${moeda.name}`).join(', '); // exibir moeda do pais com o simbolo correto
            const idiomas = Object.values(pais.languages).join(", "); // virgula para se caso possuir mais de uma    

            $("#countryCurrency").text(moedasInfo);
            $("#countryPopulation").text(pais.population.toLocaleString());
            $("#countryContinent").text(pais.continents.join(", "));
            $("#countryLanguage").text(idiomas);
            $("#countryEmoji").text(pais.flag);

        }).fail(function () {
            alert("Erro ao carregar os detalhes do país.");
        });
    } else {
        alert("Nome do país não encontrado na URL.");
    }
});