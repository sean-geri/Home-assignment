import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Trainer } from './trainer.entity.js';
import { Pokemon } from '../pokemon/pokemon.entity.js';
import { TrainerGender } from './trainer-gender.enum.js';
import { TrainerPokemonLocation } from './trainer-pokemon-location.enum.js';

@Entity('trainer_pokemon')
export class TrainerPokemon {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Trainer, { nullable: false })
  @JoinColumn({ name: 'trainerId' })
  trainer: Trainer;

  @ManyToOne(() => Pokemon, { nullable: false })
  @JoinColumn({ name: 'pokemonId' })
  pokemon: Pokemon;

  @Column()
  nickname: string;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'enum', enum: TrainerGender })
  gender: TrainerGender;

  @Column({
    type: 'enum',
    enum: TrainerPokemonLocation,
    default: TrainerPokemonLocation.BANK,
  })
  location: TrainerPokemonLocation;
}
