import type { Pokemon, PokemonDetails } from "../types/pokemon";

export function toPokemon(detail: PokemonDetails): Pokemon {
  return {
    id: detail.id,
    name: detail.name,
    imageUrl: detail.sprites.other["official-artwork"].front_default
              ?? detail.sprites.front_default
              ?? "/placeholder.png",
    types: detail.types.map(t => t.type.name),
    height: detail.height / 10,
    weight: detail.weight / 10,
    stats: detail.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
    abilities: detail.abilities.map(a => a.ability.name),
  };
}