$(document).ready(function () {
    var cloneOriginal = $("#flag-card").clone();
    var dados = []; // Armazena os dados de países

    // Função para criar e adicionar um card de país
    function appendCountryCard(pais) {
        var clonecard = cloneOriginal.clone();
        if (pais.name.common === "Nepal") {
            $(".card-img-top", clonecard).attr("style", "height: 200px; width: 100%; object-fit: fill;");
        }

        $(".card-img-top", clonecard).attr("src", pais.flags.svg);
        $(".card-title", clonecard).text(pais.name.common);
        $("#flag-card").append(clonecard); // Adiciona o card ao DOM
    }

    // Função para exibir 3 países aleatórios
    function showRandomCountries() {
        $("#flag-card").html(""); // Limpa a lista antes de adicionar novos países

        // Seleciona 3 países aleatórios da lista
        const randomCountries = dados.sort(() => 0.5 - Math.random()).slice(0, 3);

        // Adiciona cada país selecionado na lista
        randomCountries.forEach(appendCountryCard);
    }

    // Chamada inicial após o carregamento dos dados
    $.ajax({
        method: "GET",
        url: "https://restcountries.com/v3.1/all",
    }).done(function (response) {
        dados = response; // Armazena os dados em uma variável global
        showRandomCountries(); // Exibe 3 países aleatórios inicialmente

        // Atualizar a lista com todos os países
        $("#flag-card").html(""); // Limpar a lista
        dados.forEach(showRandomCountries); // Exibe todos os países
        console.log(dados); // Exibe os dados no console
    });
});