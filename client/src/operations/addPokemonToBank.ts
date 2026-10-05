import { assignPokemonToTrainer } from '../app-api';
import type { AssignPokemonInput, TrainerPokemon } from '../types';

export function addPokemonToBank(
  trainerId: number,
  input: AssignPokemonInput,
): Promise<TrainerPokemon> {
  return assignPokemonToTrainer(trainerId, input);
}
