import type {
  AssignPokemonInput,
  CreateTrainerInput,
  Pokemon,
  Trainer,
  TrainerPokemon,
  TrainerPokemonLocation,
} from './types';

const BASE_URL = 'http://localhost:3008';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export function getTrainers(): Promise<Trainer[]> {
  return request<Trainer[]>('/trainers');
}

export function createTrainer(input: CreateTrainerInput): Promise<Trainer> {
  return request<Trainer>('/trainers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function searchPokemon(search: string): Promise<Pokemon[]> {
  const params = new URLSearchParams({ search });
  return request<Pokemon[]>(`/pokemon?${params.toString()}`);
}

export function assignPokemonToTrainer(
  trainerId: number,
  input: AssignPokemonInput,
): Promise<TrainerPokemon> {
  return request<TrainerPokemon>(`/trainers/${trainerId}/pokemon`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getTrainerPokemon(
  trainerId: number,
): Promise<TrainerPokemon[]> {
  return request<TrainerPokemon[]>(`/trainers/${trainerId}/pokemon`);
}

export function updateTrainerPokemonLocation(
  trainerId: number,
  id: number,
  location: TrainerPokemonLocation,
): Promise<TrainerPokemon> {
  return request<TrainerPokemon>(
    `/trainers/${trainerId}/pokemon/${id}/location`,
    {
      method: 'PATCH',
      body: JSON.stringify({ location }),
    },
  );
}
