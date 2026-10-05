import { updateTrainerPokemonLocation } from '../app-api';
import type { TrainerPokemon, TrainerPokemonLocation } from '../types';

export function updatePokemonLocation(
  trainerId: number,
  id: number,
  location: TrainerPokemonLocation,
): Promise<TrainerPokemon> {
  return updateTrainerPokemonLocation(trainerId, id, location);
}
