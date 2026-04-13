import { useState, useEffect, useCallback } from 'react';
import type { Pokemon } from '../types/pokemon';
import type { PokemonListResult } from './types';
import { fetchPokemonList } from '../api/pokemonapi';

type FetchState =
  | { status: 'loading' }
  | { status: 'success'; data: Pokemon[] }
  | { status: 'error'; error: string }
  | { status: 'empty' };

export function usePokemonList(searchQuery: string): PokemonListResult {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [state, setState] = useState<FetchState>({ status: 'loading' });

  const loadPokemon = useCallback(() => {
    const controller = new AbortController();

    setState({ status: 'loading' });

    fetchPokemonList(controller.signal)
      .then(data => {
        setAllPokemon(data);
      })
      .catch(err => {
        if (err.name === 'AbortError') return;
        setState({ status: 'error', error: err.message });
      });

    return controller;
  }, []);

  useEffect(() => {
    const controller = loadPokemon();

    return () => {
      controller.abort();
    };
  }, [loadPokemon]);

  useEffect(() => {
    if (allPokemon.length === 0 && state.status === 'loading') return;

    const query = searchQuery.toLowerCase().trim();
    const filtered = query
      ? allPokemon.filter(p => p.name.toLowerCase().includes(query))
      : allPokemon;

    if (filtered.length === 0 && query) {
      setState({ status: 'empty' });
    } else if (filtered.length > 0) {
      setState({ status: 'success', data: filtered });
    }
  }, [searchQuery, allPokemon]);

  const refetch = useCallback(() => {
    const controller = loadPokemon();
    return () => controller.abort();
  }, [loadPokemon]);

  return {
    status: state.status,
    data: state.status === 'success' ? state.data : [],
    error: state.status === 'error' ? state.error : null,
    refetch,
  };
}