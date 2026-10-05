import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { TrainerService } from './trainer.service.js';
import { TrainerPokemonService } from './trainer-pokemon.service.js';
import { CreateTrainerDto } from './dto/create-trainer.dto.js';
import { AssignTrainerPokemonDto } from './dto/assign-trainer-pokemon.dto.js';
import { UpdateTrainerPokemonLocationDto } from './dto/update-trainer-pokemon-location.dto.js';
import { Trainer } from './trainer.entity.js';
import { TrainerPokemonResponse } from './trainer-pokemon.types.js';

@Controller('trainers')
export class TrainerController {
  constructor(
    private readonly trainerService: TrainerService,
    private readonly trainerPokemonService: TrainerPokemonService,
  ) {}

  @Get()
  findAll(): Promise<Trainer[]> {
    return this.trainerService.findAll();
  }

  @Post()
  create(@Body() createTrainerDto: CreateTrainerDto): Promise<Trainer> {
    return this.trainerService.create(createTrainerDto);
  }

  @Get(':trainerId/pokemon')
  findTrainerPokemon(
    @Param('trainerId', ParseIntPipe) trainerId: number,
  ): Promise<TrainerPokemonResponse[]> {
    return this.trainerPokemonService.findByTrainerId(trainerId);
  }

  @Post(':trainerId/pokemon')
  assignPokemon(
    @Param('trainerId', ParseIntPipe) trainerId: number,
    @Body() assignTrainerPokemonDto: AssignTrainerPokemonDto,
  ): Promise<TrainerPokemonResponse> {
    return this.trainerPokemonService.assign(
      trainerId,
      assignTrainerPokemonDto,
    );
  }

  @Patch(':trainerId/pokemon/:id/location')
  updatePokemonLocation(
    @Param('trainerId', ParseIntPipe) trainerId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLocationDto: UpdateTrainerPokemonLocationDto,
  ): Promise<TrainerPokemonResponse> {
    return this.trainerPokemonService.updateLocation(
      trainerId,
      id,
      updateLocationDto,
    );
  }
}
