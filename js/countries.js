// [FILE: details.html]
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
        $(".capital-pais", clonecard).text(pais.capital ? pais.capital[0] : "Não disponível");
    
        // Recuperar a lista de favoritos do localStorage
        var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
        // Verificar se o país já está nos favoritos
        var isFavorite = favorites.some(function (favorite) {
            return favorite.name === pais.name.common;
        });
    
        // Alternar a visibilidade dos ícones com base na verificação
        if (isFavorite) {
            $('#btn-favorite svg.bi-heart', clonecard).hide(); // Oculta o coração não preenchido
            $('#btn-favorite svg.bi-heart-fill', clonecard).show(); // Exibe o coração preenchido
        } else {
            $('#btn-favorite svg.bi-heart', clonecard).show(); // Exibe o coração não preenchido
            $('#btn-favorite svg.bi-heart-fill', clonecard).hide(); // Oculta o coração preenchido
        }
    
        // Adicionando eventos de clique dentro do escopo do clone
        $('#btn-details', clonecard).on("click", function () {
            console.log('details.html?country=' + encodeURIComponent(pais.name.common));
            window.location.href = 'details.html?country=' + encodeURIComponent(pais.name.common);
        });
    
        $('#btn-favorite', clonecard).on("click", function () {
            // Criar um objeto com as informações do país
            var countryData = {
                flag: pais.flags.svg,
                name: pais.name.common,
                capital: pais.capital ? pais.capital[0] : "Não disponível",
                population: pais.population // Salva como número
            };
    
            // Recuperar a lista de favoritos do localStorage
            var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    
            // Verificar se o país já está nos favoritos (evitar duplicação)
            var exists = favorites.some(function (favorite) {
                return favorite.name === countryData.name;
            });
    
            if (!exists) {
                // Adicionar o novo país à lista de favoritos
                favorites.push(countryData);
    
                // Atualizar o localStorage
                localStorage.setItem('favorites', JSON.stringify(favorites));
    
                console.log('País adicionado aos favoritos:', countryData);
                
                // Alternar a visibilidade dos ícones
                $('#btn-favorite svg.bi-heart', clonecard).hide(); // Oculta o coração não preenchido
                $('#btn-favorite svg.bi-heart-fill', clonecard).show(); // Exibe o coração preenchido
            } else {
                // Remover o país da lista de favoritos
                favorites = favorites.filter(function (favorite) {
                    return favorite.name !== countryData.name;
                });
    
                // Atualizar o localStorage
                localStorage.setItem('favorites', JSON.stringify(favorites));
    
                console.log('País removido dos favoritos:', countryData);
                
                // Alternar a visibilidade dos ícones
                $('#btn-favorite svg.bi-heart', clonecard).show(); // Exibe o coração não preenchido
                $('#btn-favorite svg.bi-heart-fill', clonecard).hide(); // Oculta o coração preenchido
            }
        });
    
        $('#img-details', clonecard).on("click", function () {
            console.log('details.html?country=' + encodeURIComponent(pais.name.common));
            window.location.href = 'details.html?country=' + encodeURIComponent(pais.name.common);
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

