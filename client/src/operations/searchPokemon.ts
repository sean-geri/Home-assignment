import { searchPokemon as searchPokemonApi } from '../app-api';
import type { Pokemon } from '../types';

export function searchPokemon(search: string): Promise<Pokemon[]> {
  return searchPokemonApi(search);
}
