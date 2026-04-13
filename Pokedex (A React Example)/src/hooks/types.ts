import type { Pokemon } from '../types/pokemon';

export type PokemonListResult = {
  status: 'loading' | 'success' | 'error' | 'empty';
  data: Pokemon[];
  error: string | null;
  refetch: () => void;
};