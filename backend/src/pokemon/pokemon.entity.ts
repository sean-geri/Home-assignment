import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('pokemon')
export class Pokemon {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column()
  type1: string;

  @Column({ type: 'varchar', nullable: true })
  type2: string | null;

  @Column()
  weight: number;

  @Column()
  height: number;
}
