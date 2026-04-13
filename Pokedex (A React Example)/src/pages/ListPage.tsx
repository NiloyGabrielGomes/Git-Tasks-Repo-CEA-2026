import { useState } from 'react';
import { usePokemonListRQ } from '../hooks/usePokemonListRQ';
import { SearchBar } from '../components/SearchBar';
import { PokemonGrid } from '../components/PokemonGrid';
import { SkeletonCard } from '../components/SkeletonCard';

function ListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { status, data, error, refetch } = usePokemonListRQ(searchQuery);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pokédex</h1>

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {status === 'loading' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mx-auto">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="text-center py-10">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {status === 'empty' && (
        <div className="text-center text-gray-500 py-10">
          No Pokémon found matching "{searchQuery}"
        </div>
      )}

      {status === 'success' && <PokemonGrid pokemon={data} />}
    </div>
  );
}

export default ListPage;