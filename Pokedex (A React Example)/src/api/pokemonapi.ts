import type { Pokemon, PokemonDetails, PokemonListResponse } from "../types/pokemon";
import { toPokemon } from "./transforms";

const BASE_URL = "https://pokeapi.co/api/v2";

export async function fetchPokemonList(
  signal?: AbortSignal,
  query?: string
): Promise<Pokemon[]> {
  const normalized = query?.toLowerCase().trim();
  if (normalized) {
    try {
      const res = await fetch(`${BASE_URL}/pokemon/${encodeURIComponent(normalized)}`, { signal });
      if (!res.ok) {
        if (res.status === 404) return [];
        throw new Error(`Failed to fetch ${normalized}: ${res.status}`);
      }
      const detail: PokemonDetails = await res.json();
      return [toPokemon(detail)];
    } catch (err) {
      if ((err as any)?.name === 'AbortError') throw err;
      throw err;
    }
  }

  const listRes = await fetch(`${BASE_URL}/pokemon?limit=150`, { signal });
  if (!listRes.ok) throw new Error(`Failed to fetch list: ${listRes.status}`);
  const listData: PokemonListResponse = await listRes.json();

  const detailPromises = listData.results.map(item =>
    fetch(item.url, { signal }).then(res => {
      if (!res.ok) throw new Error(`Failed to fetch ${item.name}: ${res.status}`);
      return res.json() as Promise<PokemonDetails>;
    })
  );

  const details = await Promise.all(detailPromises);

  return details.map(toPokemon);
}

export async function fetchPokemonById(
  id: number | string,
  signal?: AbortSignal
): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${id}`, { signal });
  if (!res.ok) throw new Error(`Pokemon not found: ${res.status}`);
  const detail: PokemonDetails = await res.json();
  return toPokemon(detail);
}