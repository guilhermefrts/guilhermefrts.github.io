const fetchEvolution = async (pokemonSpeciesURL) => {
    const response = await fetch(pokemonSpeciesURL);
    if (response.status === 200) {
      const data = await response.json();
      return data;
    }
    return null;
  };

const fetchPokemon = async (pokemon) => {
  const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
  
  if (APIResponse.status === 200) {
    const data = await APIResponse.json();
    return data;
  }
}
const getLanguage = () => {
  const language = navigator.language;
  const primaryLanguage = language.split('-')[0]; // Obtém o idioma principal
  return primaryLanguage;
};

const renderPokemon = async (pokemon) => {
    const pokemonName = document.querySelector('.pokemon__name');
    const pokemonNumber = document.querySelector('.pokemon__number');
    const pokemonTypes = document.querySelector('.pokemon__types');
    const pokemonEvolutions = document.querySelector('.pokemon__evolutions');
    const pokemonImage = document.querySelector('.pokemon__image');
    const pokemonImage2 = document.querySelector('.pokemon__image2');
  
    pokemonName.innerHTML = 'Loading...';
    pokemonNumber.innerHTML = '';
    pokemonTypes.innerHTML = '';
    pokemonEvolutions.innerHTML = '';
  
    const data = await fetchPokemon(pokemon);
  
    if (data) {
      pokemonImage.style.display = 'block';
      pokemonName.innerHTML = data.name;
      pokemonNumber.innerHTML = data.id;
      pokemonImage.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
      pokemonImage2.src = data.sprites.versions['generation-v']['black-white'].animated.front_default;
  
      const language = getLanguage();
      const typeTranslations = typeTranslationsByLanguage[language] || typeTranslationsByLanguage['en'];
  
      data.types.forEach(type => {
        const typeElement = document.createElement('span');
        const translatedType = typeTranslations[type.type.name] || type.type.name;
        typeElement.innerHTML = translatedType;
        pokemonTypes.appendChild(typeElement);
  
        const lineBreak = document.createElement('br');
        pokemonTypes.appendChild(lineBreak);
      });
  
      const speciesData = await fetchEvolution(data.species.url);
      if (speciesData) {
        const evolutionChainURL = speciesData.evolution_chain.url;
        const evolutionChainData = await fetchEvolution(evolutionChainURL);
        if (evolutionChainData) {
          const evolutionChain = evolutionChainData.chain;
          let evolutions = [];
          let currentPokemon = evolutionChain.species;
  
          while (currentPokemon) {
            const name = currentPokemon.name;
            const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
            evolutions.push({ name, url });
            currentPokemon = currentPokemon.evolves_to[0]?.species;
          }
  
          if (evolutions.length > 1) {
            pokemonEvolutions.innerHTML = 'Evolutions: ';
  
            evolutions.forEach((evolution, index) => {
              const evolutionLink = document.createElement('a');
              evolutionLink.href = '#';
              evolutionLink.innerHTML = evolution.name;
              evolutionLink.addEventListener('click', (e) => {
                e.preventDefault();
                renderPokemon(evolution.url);
              });
              pokemonEvolutions.appendChild(evolutionLink);
  
              if (index !== evolutions.length - 1) {
                const separator = document.createTextNode(' - ');
                pokemonEvolutions.appendChild(separator);
              }
            });
          } else {
            pokemonEvolutions.innerHTML = 'No evolutions';
          }
        }
      }
  
      input.value = '';
      searchPokemon = data.id;
    } else {
      pokemonImage.style.display = 'none';
      pokemonImage2.style.display = 'none';
      pokemonName.innerHTML = 'Not found :c';
      pokemonNumber.innerHTML = '';
    }
  };
  
  const typeTranslationsByLanguage = {
    en: {
      normal: 'Normal',
      fighting: 'Fighting',
      flying: 'Flying',
      poison: 'Poison',
      ground: 'Ground',
      rock: 'Rock',
      bug: 'Bug',
      ghost: 'Ghost',
      steel: 'Steel',
      fire: 'Fire',
      water: 'Water',
      grass: 'Grass',
      electric: 'Electric',
      psychic: 'Psychic',
      ice: 'Ice',
      dragon: 'Dragon',
      dark: 'Dark',
      fairy: 'Fairy',
    },
    pt: {
      normal: 'Normal',
      fighting: 'Lutador',
      flying: 'Voador',
      poison: 'Venenoso',
      ground: 'Terrestre',
      rock: 'Pedra',
      bug: 'Inseto',
      ghost: 'Fantasma',
      steel: 'Metálico',
      fire: 'Fogo',
      water: 'Água',
      grass: 'Planta',
      electric: 'Elétrico',
      psychic: 'Psíquico',
      ice: 'Gelo',
      dragon: 'Dragão',
      dark: 'Sombrio',
      fairy: 'Fada',
    },
  };
  
  const form = document.querySelector('.form');
  const input = document.querySelector('.input__search');
  const buttonPrev = document.querySelector('.btn-prev');
  const buttonNext = document.querySelector('.btn-next');
  
  let searchPokemon = 1;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const pokemon = input.value.toLowerCase().trim();
    renderPokemon(pokemon);
  });
  
  buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
      searchPokemon -= 1;
      renderPokemon(searchPokemon);
    }
  });
  
  buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
  });
  
  renderPokemon(searchPokemon);

  const togglePokedexAnimation = () => {
    const pokedex = document.getElementById('pokedex');
    pokedex.classList.toggle('pokedex-on');
  };
  
  const toggleButton = document.querySelector('.toggle-button');
  toggleButton.addEventListener('click', togglePokedexAnimation);