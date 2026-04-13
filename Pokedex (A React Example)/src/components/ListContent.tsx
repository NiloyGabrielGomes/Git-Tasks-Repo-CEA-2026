import type { PokemonListResult } from '../hooks/types';
import { PokemonGrid } from './PokemonGrid';
import { SkeletonCard } from './SkeletonCard';

type Props = PokemonListResult & { searchQuery: string };

export function ListContent({ status, data, error, refetch, searchQuery }: Props) {
  if (status === 'loading') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={() => refetch()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (status === 'empty') {
    return (
      <div className="text-center text-gray-500 py-10">
        No Pokémon found matching "{searchQuery}"
      </div>
    );
  }

  return <PokemonGrid pokemon={data} />;
}
