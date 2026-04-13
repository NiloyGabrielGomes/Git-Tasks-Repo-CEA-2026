import React from 'react';
import { PokemonCard } from './PokemonCard';
import type { Pokemon } from '../types/pokemon';

interface PokemonGridProps {
  pokemon: Pokemon[];
}

export const PokemonGrid: React.FC<PokemonGridProps> = ({ pokemon }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
      {pokemon.map((p) => (
        <PokemonCard key={p.id} pokemon={p} />
      ))}
    </div>
  );
};