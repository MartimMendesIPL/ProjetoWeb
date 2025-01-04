$(document).ready(function () {
    var favorites = JSON.parse(localStorage.getItem('favorites')) || []; // puxa da webstorage os favoritos
    var cloneOriginal = $(".card-paises").clone();

    $(".lista-paises").html(""); 

    if (favorites.length === 0) {
        $(".lista-paises").html(`<p class="text-center w-100 mt-4 pt-4 display-6">No favorites found.</p>`); // Mensagem para quando nao houver paises
        return;
    }

    favorites.forEach(function(country) {
        var clonecard = cloneOriginal.clone();

        $(".imagem-pais", clonecard).attr("src", country.flag);
        $(".nome-pais", clonecard).text(country.name);
        $(".populacao-pais", clonecard).text(country.population.toLocaleString());
        $(".capital-pais", clonecard).text(country.capital);

        $('#img-details', clonecard).on("click", function () {
            console.log('details.html?country=' + encodeURIComponent(country.name));
            window.location.href = 'details.html?country=' + encodeURIComponent(country.name);
        });
        $('#btn-details', clonecard).on("click", function () {
            console.log('details.html?country=' + encodeURIComponent(country.name));
            window.location.href = 'details.html?country=' + encodeURIComponent(country.name); // passa o nome common do pais ataves da url do site
        });
        $('#btn-favorite', clonecard).on("click", function () { // ao clicar no card remove o pais da lista de favoritos
            var countryData = {
                flag: country.flag,
                name: country.name,
                capital: country.capital ? country.capital[0] : "Não disponível",
                population: country.population
            };
        
            var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
            var index = favorites.findIndex(function (favorite) {
                return favorite.name === countryData.name;
            });
        
            if (index !== -1) {
                favorites.splice(index, 1);

                localStorage.setItem('favorites', JSON.stringify(favorites));
                console.log('País removido dos favoritos:', countryData);
                location.reload();
            } else {
                console.log('País não está nos favoritos:', countryData);
            }
        });
        $(".lista-paises").append(clonecard);
    });
});