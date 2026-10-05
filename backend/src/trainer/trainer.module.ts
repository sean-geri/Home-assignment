import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trainer } from './trainer.entity.js';
import { TrainerPokemon } from './trainer-pokemon.entity.js';
import { Pokemon } from '../pokemon/pokemon.entity.js';
import { TrainerController } from './trainer.controller.js';
import { TrainerService } from './trainer.service.js';
import { TrainerPokemonService } from './trainer-pokemon.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Trainer, TrainerPokemon, Pokemon])],
  controllers: [TrainerController],
  providers: [TrainerService, TrainerPokemonService],
})
export class TrainerModule {}
