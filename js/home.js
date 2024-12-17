$(document).ready(function () {
    var cloneOriginal = $(".card-paises").clone();
    var dados = []; // Armazena os dados de países

    // Função para criar e adicionar um card de país
    function appendCountryCard(pais) {
        var clonecard = cloneOriginal.clone();
        if (pais.name.common === "Nepal") {
            $(".imagem-pais", clonecard).attr("style", "height: 250px; width: 100%; object-fit: fill;");
        }

        $(".imagem-pais", clonecard).attr("src", pais.flags.svg);
        $(".nome-pais", clonecard).text(pais.name.common);
        $(".lista-paises").append(clonecard); // Adiciona o card ao DOM
    }

    // Função para obter um índice aleatório
    function getRandomIndex(max) {
        return Math.floor(Math.random() * max);
    }

    // Função para exibir 3 países a partir de um índice aleatório
    function showCountriesFromRandomIndex() {
        $(".lista-paises").html(""); // Limpa a lista antes de adicionar novos países

        // Obtém um índice aleatório
        const randomIndex = getRandomIndex(dados.length - 3); // -3 para garantir que haja 3 países a serem exibidos

        // Seleciona 3 países a partir do índice aleatório
        const selectedCountries = dados.slice(randomIndex, randomIndex + 3);

        // Adiciona cada país selecionado na lista
        selectedCountries.forEach(appendCountryCard);
    }

    // Função para exibir todos os países
    function showAllCountries() {
        $(".lista-paises").html(""); // Limpa a lista antes de adicionar todos os países
        dados.forEach(appendCountryCard); // Exibe todos os países
    }

    // Chamada inicial após o carregamento dos dados
    $.ajax({
        method: "GET",
        url: "https://restcountries.com/v3.1/all",
    }).done(function (response) {
        dados = response; // Armazena os dados em uma variável global
        showCountriesFromRandomIndex(); // Exibe 3 países a partir de um índice aleatório

        // Se você quiser exibir todos os países em algum momento, chame showAllCountries()
        // showAllCountries(); // Descomente esta linha se quiser exibir todos os países
        console.log(dados); // Exibe os dados no console
    });
});