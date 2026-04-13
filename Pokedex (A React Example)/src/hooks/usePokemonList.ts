import { useState, useEffect } from 'react';
import type { Pokemon } from '../types/pokemon';
import { fetchPokemonList } from '../api/pokemonapi';

type FetchState =
  | { status: 'loading' }
  | { status: 'success'; data: Pokemon[] }
  | { status: 'error'; error: string }
  | { status: 'empty' };

export function usePokemonList() {
  const [state, setState] = useState<FetchState>({ status: 'loading' });

  useEffect(() => {
    setState({ status: 'loading' });
    
    fetchPokemonList()
      .then(data => {
        setState({ status: 'success', data });
      })
      .catch(err => {
        setState({ status: 'error', error: err.message });
      });
  }, []);

  return state;
}