import { useEffect, useState } from "react";
import Card1 from "../components/card1";
import type { PokemonTypes } from "../types/PokeTypes";

import { getPokemons } from "../Services/pokemon";

export default function Home() {
    const [pokemons, setPokemons] = useState<PokemonTypes[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPokemons();
                setTimeout(() => {
                    setPokemons(data);
                }, 2000);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const filteredPokemons = pokemons.filter((p) => {
        const searchLower = search.toLowerCase();
        return p.name.toLowerCase().includes(searchLower) || (p.habitat && p.habitat.toLowerCase().includes(searchLower)) || (p.color && p.color.toLowerCase().includes(searchLower));
    });

    return (
        <div>
            <div className="flex justify-between items-center px-20 pt-15">
                <h1 className="text-pink-300 text-4xl font-bold">POKEDEX (*^▽^*)</h1>

                <label className="input input-bordered bg-pink-300 w-1/4 rounded-full flex items-center gap-2">
                    <svg className="h-[1em] opacity-50 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" className="grow text-black" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                </label>
            </div>

            <div className="text-center text-gray-500 mb-4">Found {filteredPokemons.length} Pokemon</div>

            {filteredPokemons.length > 0 ? (
                <Card1 pokemons={filteredPokemons} />
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p className="text-xl font-semibold">No Pokemon found</p>
                    <p>Try adjusting your search or filters.</p>
                </div>
            )}
        </div>
    );
}
