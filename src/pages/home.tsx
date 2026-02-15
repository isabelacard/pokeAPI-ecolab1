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
                    setError("error");
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
            <div className="flex flex-col justify-center items-center min-h-screen">
                <p className="font-bold text-pink-800">Connection Error ＞﹏＜</p>
                <button onClick={() => window.location.reload()} className="bg-pink-300 px-4 py-1 rounded-3xl w-30 mt-5 cursor-pointer transition-all hover:bg-pink-800 hover:text-white">
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
        <div className="min-h-screen bg-gradient-to-b from-pink-100 via-pink-50 to-white">
            <div className="flex justify-between items-center px-20 pt-16">
                <h1 className="text-pink-400 text-5xl font-extrabold">POKEDEX (｡•ᴗ•｡)♡</h1>
                <label
                    className="flex items-center gap-3 w-1/3 px-4 py-2 
        bg-pink-200/70 backdrop-blur-md rounded-full 
        border-2 border-pink-300 shadow-md"
                >
                    <input
                        type="search"
                        className="grow bg-transparent text-pink-700 
                        placeholder:text-pink-400 outline-none text-sm"
                        placeholder="Search Pokémon, habitat or color… (´｡• ᵕ •｡`)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </label>
            </div>
            <div className="text-center text-pink-400/70 mt-6 mb-4 text-sm">
                Found <span className="font-bold text-pink-500">{filteredPokemons.length}</span> Pokémon ✧(｡•̀ᴗ-)✧
            </div>
            {filteredPokemons.length > 0 ? (
                <Card1 pokemons={filteredPokemons} />
            ) : (
                <div className="flex flex-col items-center justify-center h-64 text-pink-300">
                    <p className="text-3xl font-bold opacity-60">No data… (｡•́︿•̀｡)</p>
                    <p className="text-sm opacity-50 mt-2">Try another cute search ✿</p>
                </div>
            )}
        </div>
    );
}
