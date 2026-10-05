import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { TrainerGender } from '../trainer-gender.enum.js';

export class AssignTrainerPokemonDto {
  @Type(() => Number)
  @IsInt()
  pokemonId: number;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  level: number;

  @IsEnum(TrainerGender)
  gender: TrainerGender;
}
