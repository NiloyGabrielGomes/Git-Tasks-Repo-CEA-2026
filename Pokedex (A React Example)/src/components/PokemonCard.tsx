import React from "react";
import { typeColors } from "../utils/typeColors";
import type { Pokemon } from "../types/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
}

export const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
      <div className="w-40 h-40 mb-4 flex items-center justify-center">
        <img
          src={pokemon.imageUrl}
          alt={pokemon.name}
          className="w-full h-full object-contain drop-shadow-md"
        />
      </div>

      <h2 className="text-xl font-bold text-gray-800 capitalize mb-3">
        {pokemon.name}
      </h2>

      <div className="flex gap-2 flex-wrap justify-center">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className="px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider"
            style={{
              backgroundColor: typeColors[type.toLowerCase()] || "#6B7280",
            }}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
};
