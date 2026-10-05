import { getTrainerPokemon } from '../app-api';
import type { TrainerPokemon } from '../types';

export function loadTrainerPokemon(
  trainerId: number,
): Promise<TrainerPokemon[]> {
  return getTrainerPokemon(trainerId);
}
