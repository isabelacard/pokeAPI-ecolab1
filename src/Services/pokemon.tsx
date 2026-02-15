import type { PokemonTypes } from "../types/PokeTypes";

const getPokemons = async (): Promise<PokemonTypes[]> => {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=687");
    const data = await response.json();

    const promises = data.results.map(async (pokemon: { url: string }) => {
        const res = await fetch(pokemon.url);
        const pokemonData = await res.json();

        const speciesRes = await fetch(pokemonData.species.url);
        const speciesData = await speciesRes.json();

        return {
            id: pokemonData.id.toString(),
            name: pokemonData.name,
            image: pokemonData.sprites.other["official-artwork"].front_default || pokemonData.sprites.front_default,
            height: pokemonData.height,
            weight: pokemonData.weight,
            habitat: speciesData.habitat?.name || "unknown",
            color: speciesData.color?.name || "unknown",
        };
    });

    return Promise.all(promises);
};

export { getPokemons };
