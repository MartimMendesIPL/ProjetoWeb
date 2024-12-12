$(document).ready(function () {
    // Obter o nome do país da URL
    var urlParams = new URLSearchParams(window.location.search);
    var countryName = urlParams.get('country'); // Obtém o parâmetro 'country'
    console.log(countryName);
    // Fazer a requisição à API com o nome do país
    if (countryName) {
        $.ajax({
            method: "GET",
            url: `https://restcountries.com/v3.1/name/${countryName}`,
        }).done(function (dados) {
            const pais = dados[0]; // Considerando que há apenas 1 resultado

            // Atualizar a página com os detalhes do país
            $("#countryFlag").attr("src", pais.flags.svg);  // Exibir a bandeira como imagem
            $("#countryName").text(pais.name.common);  // Nome comum do país
            $("#countryLoc").attr("href", pais.maps.googleMaps);  // Link para o Google Maps

            $("#countryCapitalName").text(pais.capital ? pais.capital[0] : "Não disponível");  // Capital
            $("#countryNameOficial").text(pais.name.official);  // Nome oficial do país

            // Exibir a moeda
            const moedas = pais.currencies;
            const moedasInfo = Object.values(moedas).map(moeda => `${moeda.symbol} ${moeda.name}`).join(', ');
            $("#countryCurrency").text(moedasInfo);

            // Exibir a população formatada
            $("#countryPopulation").text(pais.population.toLocaleString());

            // Exibir o continente
            $("#countryContinent").text(pais.continents.join(", "));

            // Exibir as línguas
            const idiomas = Object.values(pais.languages).join(", ");
            $("#countryLanguage").text(idiomas);

            // Exibir o emoji da bandeira
            $("#countryEmoji").text(pais.flag);
        }).fail(function () {
            alert("Erro ao carregar os detalhes do país.");
        });
    } else {
        alert("Nome do país não encontrado na URL.");
    }
});
