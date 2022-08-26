import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cadets } from './cadets.entity';
import { Mentors } from './mentors.entity';

@Entity()
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Mentors, Mentors => Mentors.comments)
  mentors: Mentors;

  @ManyToOne(() => Cadets, Cadets => Cadets.comments)
  cadets: Cadets;

  @Column({ type: 'varchar', length: 300 })
  content: string;

  @Column({ type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
