interface ApiResource {
    name: string;
    url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonListItem {
    name: string;
    url: string;
}

export interface PokemonDetails {
    id: number;
    name: string;
    height: number; //decimeters
    weight: number; //hectograms
    types: PokemonTypeSlot[];
    stats: PokemonStat[];
    abilities: PokemonAbility[];
    sprites: PokemonSprites;
}

export interface PokemonTypeSlot {
    slot: number;
    type: ApiResource;
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: ApiResource;
}
    
export interface PokemonAbility {
    is_hidden: boolean;
    slot: number;
    ability: ApiResource;
}

export interface PokemonSprites {
    front_default: string | null;
    other: {
        "official-artwork": {
            front_default: string | null;
        }
    }
}

export interface Pokemon {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: string[];
    imageUrl: string;
    stats: { name: string; value: number }[];
    abilities: string[];
}
