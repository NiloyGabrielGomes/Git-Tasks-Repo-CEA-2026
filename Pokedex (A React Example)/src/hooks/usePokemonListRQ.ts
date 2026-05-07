import { useQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../api/pokemonapi';
import { useMemo } from 'react';

export function usePokemonListRQ(searchQuery: string) {
  const { data: allPokemon, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['pokemon-list'],
    queryFn: ({ signal }) => fetchPokemonList(signal),
  });

  const filtered = useMemo(() => {
    if (!allPokemon) return [];
    const query = searchQuery.toLowerCase().trim();
    return query
      ? allPokemon.filter(p => p.name.toLowerCase().includes(query))
      : allPokemon;
  }, [searchQuery, allPokemon]);

  const status = isLoading
    ? 'loading' as const
    : isError
    ? 'error' as const
    : filtered.length === 0 && searchQuery.trim()
    ? 'empty' as const
    : 'success' as const;

  return {
    status,
    data: filtered,
    error: error?.message ?? null,
    refetch,
  };
}