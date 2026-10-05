import { getTrainers } from '../app-api';
import type { Trainer } from '../types';

export function loadTrainers(): Promise<Trainer[]> {
  return getTrainers();
}
