import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TrainerGender } from './trainer-gender.enum.js';

@Entity('trainer')
export class Trainer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: TrainerGender })
  gender: TrainerGender;

  @Column({ type: 'int' })
  age: number;
}
