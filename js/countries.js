// [FILE: details.html]

$(document).ready(function () {
    var cloneOriginal = $(".card-paises").clone();
    var dados = []; // Armazena os dados de países
    var itemsPorPagina = 24; //Nr de cards por pagina
    var pagina = 1;

    // Limpar a lista ao carregar
    $(".lista-paises").html("");
    // Limpar a paginação ao carregar
    $(".pagination").html("");

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
    
        // Adicionando eventos de clique dentro do escopo do clone
        $('#btn-details', clonecard).on("click", function () {
            console.log('details.html?country=' + encodeURIComponent(pais.name.common));
            window.location.href = 'details.html?country='+encodeURIComponent(pais.name.common);
        });
        $('#img-details', clonecard).on("click", function () {
            console.log('details.html?country=' + encodeURIComponent(pais.name.common));
            window.location.href = 'details.html?country='+encodeURIComponent(pais.name.common);
        });
    
        $(".lista-paises").append(clonecard);
    }
    //Mostrar paises paginados
    function displayPageData(){
        $(".lista-paises").html(""); //Limpar lista

        var inicio = (pagina - 1) * itemsPorPagina;
        var fim = inicio + itemsPorPagina;

        var pageData = dados.slice(inicio, fim); //Dados apenas para a pagina atual
        pageData.forEach(appendCountryCard);
    }
    //Configurar a paginação
    function setupPagination(){
        var totalPages = Math.ceil(dados.length / itemsPorPagina);
        var paginationContainer = $(".pagination");

        paginationContainer.html(""); //Limpar Paginação

        //Anterior
        paginationContainer.append(`
            <li class="page-item ${pagina === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="Previous">&laquo;</a>
            </li>
        `);

        // Números de página
        for (var i = 1; i <= totalPages; i++) {
            paginationContainer.append(`
                <li class="page-item ${pagina === i ? 'active' : ''}">
                    <a class="page-link" href="#">${i}</a>
                </li>
            `);
        }

        //Próximo
        paginationContainer.append(`
            <li class="page-item ${pagina === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" aria-label="Next">&raquo;</a>
            </li>
        `);

        // Eventos de clique
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
    // Requisição inicial para buscar os países
    $.ajax({
        method: "GET",
        url: "https://restcountries.com/v3.1/all/",
    }).done(function (response) {
        dados = response; // Salvar os dados recebidos

        // Mostrar os paises por pagina
        displayPageData();
        setupPagination();
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
        dados = dadosOrdenados;
        pagina = 1;
        displayPageData();
        setupPagination();
    });

    $("#selectPaginacao").on("change", function () {
        var filtro = $(this).val();

        // Ordenar com base no filtro selecionado
        if (filtro === "pag-24") {
            itemsPorPagina = 24;
        } else if (filtro === "pag-32") {
            itemsPorPagina = 32;
        } else if (filtro === "pag-48") {
            itemsPorPagina = 48;
        } else if (filtro === "pag-64") {
            itemsPorPagina = 64;
        }

        // Atualizar a lista com os dados ordenados
        pagina = 1;
        displayPageData();
        setupPagination();
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