import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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

  @Column({ type: 'text', nullable: false })
  content: string;

  @Column({ nullable: false })
  isDeleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn({ nullable: false })
  updateAt: Date;
}
