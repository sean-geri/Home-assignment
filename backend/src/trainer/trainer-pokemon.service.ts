import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TrainerPokemon } from './trainer-pokemon.entity.js';
import { Trainer } from './trainer.entity.js';
import { Pokemon } from '../pokemon/pokemon.entity.js';
import { AssignTrainerPokemonDto } from './dto/assign-trainer-pokemon.dto.js';
import { UpdateTrainerPokemonLocationDto } from './dto/update-trainer-pokemon-location.dto.js';
import { TrainerPokemonLocation } from './trainer-pokemon-location.enum.js';
import { TrainerPokemonResponse } from './trainer-pokemon.types.js';
import { MAX_BAG_SIZE } from './trainer-pokemon.constants.js';

@Injectable()
export class TrainerPokemonService {
  constructor(
    @InjectRepository(TrainerPokemon)
    private readonly trainerPokemonRepository: Repository<TrainerPokemon>,
    @InjectRepository(Trainer)
    private readonly trainerRepository: Repository<Trainer>,
    @InjectRepository(Pokemon)
    private readonly pokemonRepository: Repository<Pokemon>,
    private readonly dataSource: DataSource,
  ) {}

  async findByTrainerId(trainerId: number): Promise<TrainerPokemonResponse[]> {
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId },
    });
    if (!trainer) {
      throw new NotFoundException(`Trainer ${trainerId} not found`);
    }

    const rows = await this.trainerPokemonRepository.find({
      where: { trainer: { id: trainerId } },
      relations: { pokemon: true },
      order: { id: 'ASC' },
    });

    return rows.map((row) => this.toResponse(row));
  }

  async assign(
    trainerId: number,
    dto: AssignTrainerPokemonDto,
  ): Promise<TrainerPokemonResponse> {
    const trainer = await this.trainerRepository.findOne({
      where: { id: trainerId },
    });
    if (!trainer) {
      throw new NotFoundException(`Trainer ${trainerId} not found`);
    }

    const pokemon = await this.pokemonRepository.findOne({
      where: { id: dto.pokemonId },
    });
    if (!pokemon) {
      throw new NotFoundException(`Pokemon ${dto.pokemonId} not found`);
    }

    const created = this.trainerPokemonRepository.create({
      trainer,
      pokemon,
      nickname: dto.nickname,
      level: dto.level,
      gender: dto.gender,
      location: TrainerPokemonLocation.BANK,
    });

    const saved = await this.trainerPokemonRepository.save(created);
    return this.toResponse(saved);
  }

  async updateLocation(
    trainerId: number,
    id: number,
    dto: UpdateTrainerPokemonLocationDto,
  ): Promise<TrainerPokemonResponse> {
    return this.dataSource.transaction(async (manager) => {
      const row = await manager.findOne(TrainerPokemon, {
        where: { id, trainer: { id: trainerId } },
        relations: { pokemon: true },
      });

      if (!row) {
        throw new NotFoundException(
          `TrainerPokemon ${id} not found for trainer ${trainerId}`,
        );
      }

      if (
        dto.location === TrainerPokemonLocation.BAG &&
        row.location !== TrainerPokemonLocation.BAG
      ) {
        const bagCount = await manager.count(TrainerPokemon, {
          where: {
            trainer: { id: trainerId },
            location: TrainerPokemonLocation.BAG,
          },
        });

        if (bagCount >= MAX_BAG_SIZE) {
          throw new ConflictException(`Bag is full (max ${MAX_BAG_SIZE})`);
        }
      }

      row.location = dto.location;
      const saved = await manager.save(row);
      return this.toResponse(saved);
    });
  }

  private toResponse(row: TrainerPokemon): TrainerPokemonResponse {
    return {
      id: row.id,
      nickname: row.nickname,
      level: row.level,
      gender: row.gender,
      location: row.location,
      pokemon: {
        id: row.pokemon.id,
        name: row.pokemon.name,
        type1: row.pokemon.type1,
        type2: row.pokemon.type2,
        imageUrl: row.pokemon.imageUrl,
      },
    };
  }
}
