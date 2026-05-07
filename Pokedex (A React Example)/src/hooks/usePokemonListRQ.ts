import { useQuery } from '@tanstack/react-query';
import { fetchPokemonList } from '../api/pokemonapi';
import { useMemo } from 'react';

export function usePokemonListRQ(searchQuery: string) {
  const { data: allPokemon, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['pokemon-list', searchQuery],
    queryFn: ({ signal }) => fetchPokemonList(signal, searchQuery),
  });

  const filtered = useMemo(() => {
    if (!allPokemon) return [];
    return allPokemon;
  }, [allPokemon]);

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