import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pokemon } from './pokemon.entity.js';

@Injectable()
export class PokemonService {
  constructor(
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
  ) {}

  findAll(search?: string): Promise<Pokemon[]> {
    const query = this.pokemonRepository.createQueryBuilder('pokemon');

    if (search?.trim()) {
      query.where('pokemon.name ILIKE :search', {
        search: `%${search.trim()}%`,
      });
    }

    return query.orderBy('pokemon.id', 'ASC').getMany();
  }

  async findAllIds(): Promise<number[]> {
    const rows = await this.pokemonRepository.find({ select: { id: true } });
    return rows.map((row) => row.id);
  }

  async saveMany(pokemons: Pokemon[]): Promise<void> {
    if (pokemons.length === 0) {
      return;
    }

    await this.pokemonRepository.save(pokemons);
  }
}
