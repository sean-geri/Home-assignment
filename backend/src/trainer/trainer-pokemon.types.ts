import { TrainerGender } from './trainer-gender.enum.js';
import { TrainerPokemonLocation } from './trainer-pokemon-location.enum.js';

export type TrainerPokemonResponse = {
  id: number;
  nickname: string;
  level: number;
  gender: TrainerGender;
  location: TrainerPokemonLocation;
  pokemon: {
    id: number;
    name: string;
    type1: string;
    type2: string | null;
    imageUrl: string | null;
  };
};
