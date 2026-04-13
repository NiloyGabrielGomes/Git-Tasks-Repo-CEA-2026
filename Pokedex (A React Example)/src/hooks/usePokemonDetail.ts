import { useQuery } from '@tanstack/react-query';
import { fetchPokemonById } from '../api/pokemonapi';

export function usePokemonDetail(id: string) {
  return useQuery({
    queryKey: ['pokemon', id],
    queryFn: ({ signal }) => fetchPokemonById(id, signal),
    enabled: !!id,
  });
}