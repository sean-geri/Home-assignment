import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trainer } from './trainer.entity.js';
import { CreateTrainerDto } from './dto/create-trainer.dto.js';

@Injectable()
export class TrainerService {
  constructor(
    @InjectRepository(Trainer)
    private readonly trainerRepository: Repository<Trainer>,
  ) {}

  findAll(): Promise<Trainer[]> {
    return this.trainerRepository.find({
      order: { id: 'ASC' },
    });
  }

  create(createTrainerDto: CreateTrainerDto): Promise<Trainer> {
    const trainer = this.trainerRepository.create(createTrainerDto);
    return this.trainerRepository.save(trainer);
  }
}
