import { useParams, useNavigate } from "react-router-dom";
import { usePokemonDetail } from "../hooks/usePokemonDetail";
import { typeColors } from "../utils/typeColors";

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: pokemon, isLoading, isError, error } = usePokemonDetail(id!);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600 font-medium">
        Error: {error?.message}
      </div>
    );
  }

  if (!pokemon) return null;

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center text-blue-500 hover:text-blue-700 font-medium transition-colors"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Search
      </button>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Header section with image */}
        <div className="bg-gray-50 p-8 flex justify-center border-b border-gray-100">
          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            className="w-64 h-64 object-contain drop-shadow-xl"
          />
        </div>

        <div className="p-8">
          {/* Title and ID */}
          <div className="text-center mb-6">
            <span className="text-gray-400 font-mono font-semibold tracking-widest text-sm">
              #{String(pokemon.id).padStart(3, "0")}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 capitalize mt-1">
              {pokemon.name}
            </h1>
          </div>

          {/* Types */}
          <div className="flex gap-3 justify-center mb-8">
            {pokemon.types.map((type: string) => (
              <span
                key={type}
                className="px-4 py-1.5 rounded-full text-sm font-bold text-white uppercase tracking-wider shadow-sm"
                style={{
                  backgroundColor: typeColors[type.toLowerCase()] || "#6B7280",
                }}
              >
                {type}
              </span>
            ))}
          </div>

          {/* Physical Traits Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Height</p>
              <p className="text-lg font-semibold text-gray-800">
                {pokemon.height} m
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Weight</p>
              <p className="text-lg font-semibold text-gray-800">
                {pokemon.weight} kg
              </p>
            </div>
          </div>

          {/* Abilities */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-3">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {pokemon.abilities.map((ability: string) => (
                <span
                  key={ability}
                  className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-medium capitalize"
                >
                  {ability.replace("-", " ")}
                </span>
              ))}
            </div>
          </div>

          {/* Base Stats */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Base Stats</h3>
            <div className="space-y-3">
              {pokemon.stats.map((stat: { name: string; value: number }) => {
                const percentage = Math.min((stat.value / 255) * 100, 100);

                return (
                  <div key={stat.name} className="flex items-center text-sm">
                    <span className="w-1/3 text-gray-600 capitalize font-medium">
                      {stat.name.replace("-", " ")}
                    </span>
                    <div className="w-2/3 flex items-center gap-3">
                      <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            stat.value >= 100
                              ? "bg-green-500"
                              : stat.value >= 60
                                ? "bg-blue-500"
                                : "bg-red-500"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-right font-bold text-gray-700">
                        {stat.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
