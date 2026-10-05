import { createTrainer as createTrainerApi } from '../app-api';
import type { CreateTrainerInput, Trainer } from '../types';

export function createTrainer(input: CreateTrainerInput): Promise<Trainer> {
  return createTrainerApi(input);
}
