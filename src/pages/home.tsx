import { useEffect, useState } from "react";
import Card1 from "../components/card1";
import type { PokemonTypes } from "../types/PokeTypes";
import { getPokemons } from "../Services/pokemon";

export default function Home() {
    const [pokemons, setPokemons] = useState<PokemonTypes[]>([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const [online, setOnline] = useState(navigator.onLine);

    useEffect(() => {
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPokemons();
                setTimeout(() => {
                    setPokemons(data);
                    setLoading(false);
                }, 2000);
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Unknown error occurred");
                }
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-ball loading-xl size-20 bg-pink-300"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center mt-75 min-h-screen">
                <p className="font-bold text-pink-300/40">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-white/30 px-4 py-1 rounded-3xl w-30 mt-5 cursor-pointer transition-all hover:bg-pink-800 hover:text-white">
                    Retry
                </button>
            </div>
        );
    }

    if (!online) {
        return (
            <div className="flex flex-col justify-center items-center mt-75 min-h-screen">
                <p className="font-bold text-pink-300/40">WiFi Error</p>
                <button onClick={() => window.location.reload()} className="bg-white/30 px-4 py-1 rounded-3xl w-30 mt-5 cursor-pointer transition-all hover:bg-pink-800 hover:text-white">
                    Retry
                </button>
            </div>
        );
    }

    const filteredPokemons = pokemons.filter((p) => {
        const searchLower = search.toLowerCase();
        return p.name.toLowerCase().includes(searchLower) || (p.habitat && p.habitat.toLowerCase().includes(searchLower)) || (p.color && p.color.toLowerCase().includes(searchLower));
    });

    return (
        <div>
            <div className="flex justify-between items-center px-20 pt-15">
                <h1 className="text-pink-300 text-4xl font-bold hover:scale-110 transition-all cursor-none">POKEDEX (*^▽^*)</h1>

                <label className="input input-bordered bg-pink-300 w-1/4 rounded-full flex items-center gap-2 transition-all hover:scale-103 focus-within:scale-105">
                    <svg className="h-[1em] opacity-50 text-black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </g>
                    </svg>
                    <input type="search" className="grow text-black placeholder:text-gray-600 outline-none" placeholder="Search Pokemon, Habitat or Color" value={search} onChange={(e) => setSearch(e.target.value)} />
                    {search && (
                        <button onClick={() => setSearch("")} className="text-black hover:text-gray-700 cursor-pointer">
                            ✕
                        </button>
                    )}
                </label>
            </div>

            <div className="text-center text-gray-500 mb-4 mt-5">Found {filteredPokemons.length} Pokemon</div>

            {filteredPokemons.length > 0 ? (
                <Card1 pokemons={filteredPokemons} />
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p className="text-2xl font-bold text-pink-300/40">Data not</p>
                    <p className="text-2xl font-bold text-pink-300/40">Found</p>
                </div>
            )}
        </div>
    );
}
