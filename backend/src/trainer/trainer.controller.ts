import { Body, Controller, Get, Post } from '@nestjs/common';
import { TrainerService } from './trainer.service.js';
import { CreateTrainerDto } from './dto/create-trainer.dto.js';
import { Trainer } from './trainer.entity.js';

@Controller('trainers')
export class TrainerController {
  constructor(private readonly trainerService: TrainerService) {}

  @Get()
  findAll(): Promise<Trainer[]> {
    return this.trainerService.findAll();
  }

  @Post()
  create(@Body() createTrainerDto: CreateTrainerDto): Promise<Trainer> {
    return this.trainerService.create(createTrainerDto);
  }
}
