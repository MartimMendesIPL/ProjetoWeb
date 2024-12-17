$(document).ready(function () {
    // Recuperar a lista de favoritos do localStorage
    var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    var cloneOriginal = $(".card-paises").clone();
    $(".lista-paises").html(""); 
    // Check if the favorites array is not empty
    if (favorites.length === 0) {
        $(".lista-paises").html(`<p class="text-center w-100 mt-4 pt-4 display-6">No favorites found.</p>`);
        return; // Exit if there are no favorites
    }

    // Clear the list before appending new items

    // Loop through the favorites array and append each country to the list
    favorites.forEach(function(country) {
        // Clone the original card template
        var clonecard = cloneOriginal.clone(); // Use .first() to ensure we clone only one instance
        // Assuming you have a way to set the country name in the cloned card
        $(".imagem-pais", clonecard).attr("src", country.flag);
        $(".nome-pais", clonecard).text(country.name);
        $(".populacao-pais", clonecard).text(country.population.toLocaleString()); // Set the country name in the cloned card
        $(".capital-pais", clonecard).text(country.capital);
        // Append the cloned card to the list
        $('#btn-favorite', clonecard).on("click", function () {
            // Criar um objeto com as informações do país
            var countryData = {
                flag: country.flag,
                name: country.name,
                capital: country.capital ? country.capital[0] : "Não disponível",
                population: country.population // Salva como número
            };
        
            // Recuperar a lista de favoritos do localStorage
            var favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        
            // Verificar se o país já está nos favoritos
            var index = favorites.findIndex(function (favorite) {
                return favorite.name === countryData.name;
            });
        
            if (index !== -1) {
                // Remover o país da lista de favoritos
                favorites.splice(index, 1);
        
                // Atualizar o localStorage
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