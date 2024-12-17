$(document).ready(function () {
    var cloneOriginal = $(".card-paises").clone(); var dados = []; var itemsPorPagina = 24; var pagina = 1; // declaração de variaveis

    $(".lista-paises").html(""); // limpar o card modelo
    $(".pagination").html(""); // limpar o navbar da paginação.
    function appendCountryCard(pais) { // Função para adicionar os paises
        var clonecard = cloneOriginal.clone();
        if (pais.name.common === "Nepal") {
            $(".imagem-pais", clonecard).attr("style", "height: 200px; width: 100%; object-fit: fill;");
        }
        $(".imagem-pais", clonecard).attr("src", pais.flags.svg);
        $(".nome-pais", clonecard).text(pais.name.common);
        $(".populacao-pais", clonecard).text(pais.population.toLocaleString());
        $(".capital-pais", clonecard).text(pais.capital ? pais.capital[0] : "Não disponível");
    
        var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        var isFavorite = favorites.some(function (favorite) {
            return favorite.name === pais.name.common;
        });if (isFavorite) {
            $('#btn-favorite svg.bi-heart', clonecard).hide(); // Oculta o coração não preenchido
            $('#btn-favorite svg.bi-heart-fill', clonecard).show(); // Exibe o coração preenchido
        } else {
            $('#btn-favorite svg.bi-heart', clonecard).show(); // Exibe o coração não preenchido
            $('#btn-favorite svg.bi-heart-fill', clonecard).hide(); // Oculta o coração preenchido
        }
    
        $('#btn-details', clonecard).on("click", function () {
            console.log('details.html?country=' + encodeURIComponent(pais.name.common));
            window.location.href = 'details.html?country=' + encodeURIComponent(pais.name.common);
        });
        $('#btn-favorite', clonecard).on("click", function () {
            var countryData = {
                flag: pais.flags.svg,
                name: pais.name.common,
                capital: pais.capital ? pais.capital[0] : "Não disponível",
                population: pais.population
            };
            var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            var exists = favorites.some(function (favorite) {
                return favorite.name === countryData.name;
            });if (!exists) {
                favorites.push(countryData);

                localStorage.setItem('favorites', JSON.stringify(favorites));
                console.log('País adicionado aos favoritos:', countryData);
                $('#btn-favorite svg.bi-heart', clonecard).hide();
                $('#btn-favorite svg.bi-heart-fill', clonecard).show();
            } else {
                favorites = favorites.filter(function (favorite) {
                    return favorite.name !== countryData.name;
                });
                localStorage.setItem('favorites', JSON.stringify(favorites));
                console.log('País removido dos favoritos:', countryData);
                $('#btn-favorite svg.bi-heart', clonecard).show();
                $('#btn-favorite svg.bi-heart-fill', clonecard).hide();
            }
        });
        $('#img-details', clonecard).on("click", function () {
            console.log('details.html?country=' + encodeURIComponent(pais.name.common));
            window.location.href = 'details.html?country=' + encodeURIComponent(pais.name.common);
        });
        $(".lista-paises").append(clonecard);
    }
    //Secção de Paginação
    function displayPageData(){
        $(".lista-paises").html("");

        var inicio = (pagina - 1) * itemsPorPagina;
        var fim = inicio + itemsPorPagina;
        var pageData = dados.slice(inicio, fim);
        pageData.forEach(appendCountryCard);
    }
    function setupPagination(){
        var totalPages = Math.ceil(dados.length / itemsPorPagina);
        var paginationContainer = $(".pagination");

        paginationContainer.html("");

        paginationContainer.append(`
            <li class="page-item ${pagina === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="Previous">&laquo;</a>
            </li>
        `);
        for (var i = 1; i <= totalPages; i++) {
            paginationContainer.append(`
                <li class="page-item ${pagina === i ? 'active' : ''}">
                    <a class="page-link" href="#">${i}</a>
                </li>
            `);
        }

        paginationContainer.append(`
            <li class="page-item ${pagina === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="Next">&raquo;</a>
            </li>
        `);

        $(".page-link").on("click", function (e) {
            e.preventDefault();
            var text = $(this).text();

            if (text === "«" && pagina > 1) pagina--;
            else if (text === "»" && pagina < totalPages) pagina++;
            else if (!isNaN(parseInt(text))) pagina = parseInt(text);

            displayPageData();
            setupPagination();
        });
    }
    //Secção de Query 
    $.ajax({
        method: "GET",
        url: "https://restcountries.com/v3.1/all/",
    }).done(function (response) {
        dados = response;
        displayPageData();
        setupPagination();
    });
    //Secção de Filtros
    $("#selectFiltro").on("change", function () {
        var filtro = $(this).val();
        var dadosOrdenados = [...dados];

        if (filtro === "name-asc") {
            dadosOrdenados.sort((a, b) => a.name.common.localeCompare(b.name.common));
        } else if (filtro === "name-desc") {
            dadosOrdenados.sort((a, b) => b.name.common.localeCompare(a.name.common));
        } else if (filtro === "people-asc") {
            dadosOrdenados.sort((a, b) => a.population - b.population);
        } else if (filtro === "people-desc") {
            dadosOrdenados.sort((a, b) => b.population - a.population);
        }

        dados = dadosOrdenados;
        pagina = 1;
        displayPageData();
        setupPagination();
    });
    $("#selectPaginacao").on("change", function () {
        var filtro = $(this).val();

        if (filtro === "pag-24") {
            itemsPorPagina = 24;
        } else if (filtro === "pag-32") {
            itemsPorPagina = 32;
        } else if (filtro === "pag-48") {
            itemsPorPagina = 48;
        } else if (filtro === "pag-64") {
            itemsPorPagina = 64;
        }

        pagina = 1;
        displayPageData();
        setupPagination();
    });
    $("#btn-search").on("click", function () {
        var termoBusca = $("#searchInput").val().trim();

        if (termoBusca === "") {
            alert("Por favor, insira um termo de busca.");
            return;
        }

        $(".lista-paises").html("");

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
    $("#searchInput").on("keypress", function (e) {
        if (e.which === 13) {
            $("#btn-search").click();
        }
    });
});