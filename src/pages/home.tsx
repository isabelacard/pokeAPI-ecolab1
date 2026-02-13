import Card1 from "../components/card1";

export default function home() {
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
                </label>
            </div>
            <Card1 />
        </div>
    );
}
