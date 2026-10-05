import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pokemon } from './pokemon.entity.js';
import { PokemonController } from './pokemon.controller.js';
import { PokemonService } from './pokemon.service.js';
import { PokeApiService } from './pokeapi.service.js';
import { PokemonSyncService } from './pokemon-sync.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Pokemon])],
  controllers: [PokemonController],
  providers: [PokemonService, PokeApiService, PokemonSyncService],
})
export class PokemonModule {}
