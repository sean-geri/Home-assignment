import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
} from 'class-validator';
import { TrainerGender } from '../trainer-gender.enum.js';

export class CreateTrainerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(TrainerGender)
  gender: TrainerGender;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  age: number;
}
