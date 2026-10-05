export type Gender = 'MALE' | 'FEMALE';

export type Trainer = {
  id: number;
  name: string;
  gender: Gender;
  age: number;
};

export type CreateTrainerInput = {
  name: string;
  gender: Gender;
  age: number;
};

export type Pokemon = {
  id: number;
  name: string;
  type1: string;
  type2: string | null;
  weight: number;
  height: number;
  imageUrl: string | null;
};

export type AssignPokemonInput = {
  pokemonId: number;
  nickname: string;
  level: number;
  gender: Gender;
};

export type TrainerPokemon = {
  id: number;
  nickname: string;
  level: number;
  gender: Gender;
  location: string;
  pokemon: {
    id: number;
    name: string;
    type1: string;
    type2: string | null;
    imageUrl: string | null;
  };
};
