$(document).ready(function () {
    var cloneOriginal = $(".card-paises").clone();
    var dados = []; // Armazena os dados de países

    // Limpar a lista ao carregar
    $(".lista-paises").html("");

    // Função para criar e adicionar um card de país
    function appendCountryCard(pais) {
        var clonecard = cloneOriginal.clone();
        if (pais.name.common === "Nepal") {
            $(".imagem-pais", clonecard).attr("style", "height: 200px; width: 100%; object-fit: fill;");
        }
        $(".imagem-pais", clonecard).attr("src", pais.flags.svg);
        $(".nome-pais", clonecard).text(pais.name.common);
        $(".populacao-pais", clonecard).text(pais.population.toLocaleString());
        $('#btn-details').on("click", function () {
            // Redireciona para a página de detalhes com o nome do país na query string
            window.location.href = `details.html?country=${encodeURIComponent(pais.name.common)}`;
        });
        $('#img-details').on("click", function () {
            // Redireciona para a página de detalhes com o nome do país na query string
            window.location.href = `details.html?country=${encodeURIComponent(pais.name.common)}`;
        });
        $(".lista-paises").append(clonecard);
    }

    // Requisição inicial para buscar os países
    $.ajax({
        method: "GET",
        url: "https://restcountries.com/v3.1/all/",
    }).done(function (response) {
        dados = response; // Salvar os dados recebidos

        // Adicionar os países na lista inicial
        dados.forEach(appendCountryCard);
    });

    // Manipular o filtro de ordenação
    $("#selectFiltro").on("change", function () {
        var filtro = $(this).val();
        var dadosOrdenados = [...dados]; // Clonar os dados originais

        // Ordenar com base no filtro selecionado
        if (filtro === "name-asc") {
            dadosOrdenados.sort((a, b) => a.name.common.localeCompare(b.name.common));
        } else if (filtro === "name-desc") {
            dadosOrdenados.sort((a, b) => b.name.common.localeCompare(a.name.common));
        } else if (filtro === "people-asc") {
            dadosOrdenados.sort((a, b) => a.population - b.population);
        } else if (filtro === "people-desc") {
            dadosOrdenados.sort((a, b) => b.population - a.population);
        }

        // Atualizar a lista com os dados ordenados
        $(".lista-paises").html(""); // Limpar a lista
        dadosOrdenados.forEach(appendCountryCard);
    });

    // Manipular o botão de busca
    $("#btn-search").on("click", function () {
        var termoBusca = $("#searchInput").val().trim();

        if (termoBusca === "") {
            alert("Por favor, insira um termo de busca.");
            return;
        }

        $(".lista-paises").html(""); // Limpar a lista atual

        // Fazer uma nova requisição à API de tradução
        $.ajax({
            method: "GET",
            url: "https://restcountries.com/v3.1/translation/" + termoBusca,
        }).done(function (response) {
            console.log(response);

            response.forEach(function (pais) {
                appendCountryCard(pais);
            });
        }).fail(function () {
            alert("Nenhum país encontrado para o termo de busca informado.");
        });
    });

    // Permitir busca ao pressionar Enter
    $("#searchInput").on("keypress", function (e) {
        if (e.which === 13) {
            $("#btn-search").click(); // Simular clique no botão de busca
        }
    });
});

