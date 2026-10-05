import { IsEnum } from 'class-validator';
import { TrainerPokemonLocation } from '../trainer-pokemon-location.enum.js';

export class UpdateTrainerPokemonLocationDto {
  @IsEnum(TrainerPokemonLocation)
  location: TrainerPokemonLocation;
}
