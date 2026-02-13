import { useEffect, useState } from "react";
import type { PokemonTypes } from "../types/PokeTypes";

export default function Card1() {
    const [pokemons, setPokemons] = useState<PokemonTypes[]>([]);
    useEffect(() => {
        fetch("https://pokeapi.co/api/v2/pokemon?limit=687")
            .then((response) => response.json())
            .then((data) => {
                const promises = data.results.map((pokemon: { url: string }) =>
                    fetch(pokemon.url)
                        .then((res) => res.json())
                        .then((details) =>
                            fetch(details.species.url)
                                .then((res) => res.json())
                                .then((speciesData) => ({
                                    id: details.id.toString(),
                                    name: details.name,
                                    image: details.sprites.other["official-artwork"].front_default || details.sprites.front_default,
                                    height: details.height,
                                    weight: details.weight,
                                    habitat: speciesData.habitat?.name || "unknown",
                                    color: speciesData.color?.name || "unknown",
                                }))
                        )
                );
                return Promise.all(promises);
            })
            .then((results) => setPokemons(results))
            .catch((error) => console.error("Error", error));
    }, []);

    return (
        <div>
            <div className="p-6 flex flex-wrap gap-6 justify-center">
                {pokemons.map((p) => (
                    <div key={p.id} className="w-64 bg-pink-50 m-4 border border-pink-200 rounded-3xl shadow-md p-5 flex flex-col items-center text-center hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                        <img src={p.image} alt={p.name} className="w-28 h-28 object-cover rounded-2xl mb-3 border border-pink-200 shadow-sm" />
                        <h3 className="text-pink-700 font-semibold text-lg line-clamp-1 capitalize">{p.name}</h3>

                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                            <p>Habitat: {p.habitat}</p>
                            <p>Color: {p.color}</p>
                        </div>

                        <div className="flex items-center gap-4 mt-3 text-sm font-bold text-pink-800">
                            <p>W: {p.weight}hg</p>
                            <p>H: {p.height}dm</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
