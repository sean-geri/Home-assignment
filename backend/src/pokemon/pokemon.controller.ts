import { Controller, Get, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service.js';
import { Pokemon } from './pokemon.entity.js';

@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Get()
  findAll(@Query('search') search?: string): Promise<Pokemon[]> {
    return this.pokemonService.findAll(search);
  }
}
