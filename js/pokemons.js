document.addEventListener("DOMContentLoaded", () => {
    const pokemonGrid = document.getElementById('pokemon-grid');
    let loadedPokemons = 0;
    const loadBatchSize = 20;
    let allPokemons = [];

    const typeColors = {
        normal: '#A8A77A',
        fire: '#EE8130',
        water: '#6390F0',
        electric: '#F7D02C',
        grass: '#7AC74C',
        ice: '#96D9D6',
        fighting: '#C22E28',
        poison: '#A33EA1',
        ground: '#E2BF65',
        flying: '#A98FF3',
        psychic: '#F95587',
        bug: '#A6B91A',
        rock: '#B6A136',
        ghost: '#735797',
        dragon: '#6F35FC',
        dark: '#705746',
        steel: '#B7B7CE',
        fairy: '#D685AD',
    };

    async function fetchPokemonBatch(offset, limit) {
        for (let i = offset; i < offset + limit; i++) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i + 1}`);
            const pokemon = await response.json();
            allPokemons.push(pokemon);
            displayPokemon(pokemon);
        }
    }

    async function fetchHighQualityImage(pokemon) {
        const response = await fetch(pokemon.sprites.other['official-artwork'].front_default);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    async function displayPokemon(pokemon) {
        const pokemonCard = document.createElement('div');
        pokemonCard.classList.add('pokemon-card');

        // Cambiar color fondo
        const primaryType = pokemon.types[0].type.name;
        pokemonCard.style.backgroundColor = typeColors[primaryType];

        const highQualityImageURL = await fetchHighQualityImage(pokemon);

        const pokemonImage = document.createElement('img');
        pokemonImage.src = highQualityImageURL;
        pokemonImage.alt = pokemon.name;
        pokemonImage.classList.add('pokemon-image');

        const pokemonDetails = document.createElement('div');
        pokemonDetails.classList.add('pokemon-details');

        pokemonDetails.innerHTML = `
            <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
            <p>Nivel: ${pokemon.base_experience}</p>
            <p>${pokemon.types.map(type => type.type.name).join(', ')}</p>
            <button onclick="location.href='detalles.html?id=${pokemon.id}'">Saber más</button>
        `;

        pokemonCard.appendChild(pokemonImage);
        pokemonCard.appendChild(pokemonDetails);

        pokemonGrid.appendChild(pokemonCard);
    }

    function clearPokemonGrid() {
        pokemonGrid.innerHTML = '';
    }
    /*BY: DAVID CREAT - EAS1*/
    function sortPokemons(criteria) {
        clearPokemonGrid();
        let sortedPokemons = [];
        switch (criteria) {
            case 'name-az':
                sortedPokemons = allPokemons.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-za':
                sortedPokemons = allPokemons.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'id-asc':
                sortedPokemons = allPokemons.sort((a, b) => a.id - b.id);
                break;
            case 'id-desc':
                sortedPokemons = allPokemons.sort((a, b) => b.id - a.id);
                break;
        }
        sortedPokemons.forEach(pokemon => displayPokemon(pokemon));
    }

    document.getElementById('sort-name-az').addEventListener('click', () => sortPokemons('name-az'));
    document.getElementById('sort-name-za').addEventListener('click', () => sortPokemons('name-za'));
    document.getElementById('sort-id-asc').addEventListener('click', () => sortPokemons('id-asc'));
    document.getElementById('sort-id-desc').addEventListener('click', () => sortPokemons('id-desc'));

    function loadMorePokemon(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fetchPokemonBatch(loadedPokemons, loadBatchSize);
                loadedPokemons += loadBatchSize;
            }
        });
    }

    const observer = new IntersectionObserver(loadMorePokemon, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    });

    const sentinel = document.querySelector('.sentinel');
    observer.observe(sentinel);

    fetchPokemonBatch(loadedPokemons, loadBatchSize);
    loadedPokemons += loadBatchSize;


    // Buscar Pokémon por nombre
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredPokemons = allPokemons.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm)
        );
        clearPokemonGrid();
        filteredPokemons.forEach(pokemon => displayPokemon(pokemon));
    });

});
/*BY: DAVID CREAT - EAS1*/