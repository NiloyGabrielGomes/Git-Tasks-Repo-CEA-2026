import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Pokemon } from '../types/pokemon';
import type { PokemonListResult } from './types';
import { fetchPokemonList } from '../api/pokemonapi';

type FetchState =
  | { status: 'loading' }
  | { status: 'success'; data: Pokemon[] }
  | { status: 'error'; error: string };

export function usePokemonList(searchQuery: string): PokemonListResult {
  const [fetchState, setFetchState] = useState<FetchState>({ status: 'loading' });

  const loadPokemon = useCallback((signal: AbortSignal) => {
    fetchPokemonList(signal, searchQuery)
      .then(data => {
        setFetchState({ status: 'success', data });
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setFetchState({ status: 'error', error: err.message });
      });
  }, [searchQuery]);

  useEffect(() => {
    const controller = new AbortController();
    loadPokemon(controller.signal);
    return () => controller.abort();
  }, [loadPokemon]);

  const refetch = useCallback(() => {
    setFetchState({ status: 'loading' });
    const controller = new AbortController();
    loadPokemon(controller.signal);
    return () => controller.abort();
  }, [loadPokemon]);

  const filtered = useMemo(() => {
    if (fetchState.status !== 'success') return [];
    return fetchState.data;
  }, [fetchState]);

  const status: PokemonListResult['status'] =
    fetchState.status === 'loading' ? 'loading'
    : fetchState.status === 'error' ? 'error'
    : filtered.length === 0 && searchQuery.trim() ? 'empty'
    : 'success';

  return {
    status,
    data: filtered,
    error: fetchState.status === 'error' ? fetchState.error : null,
    refetch,
  };
}
