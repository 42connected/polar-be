import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cadets } from './cadets.entity';
import { MentoringLogs } from './mentoring-logs.entity';
import { Mentors } from './mentors.entity';

@Entity()
export class Reports {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Mentors, Mentors => Mentors.reports)
  mentors: Mentors;

  @ManyToOne(() => Cadets, Cadets => Cadets.reports)
  cadets: Cadets;

  @Column({ type: 'varchar', length: 150, nullable: true })
  topic: string;

  @Column({ type: 'varchar', length: 5000, nullable: true })
  content: string;

  @Column({ type: 'varchar', default: [], length: 1000, nullable: true })
  imageUrl: string[];

  @Column({ type: 'varchar', length: 3000, nullable: true })
  feedbackMessage: string;

  @Column('smallint')
  feedback1: number;

  @Column('smallint')
  feedback2: number;

  @Column('smallint')
  feedback3: number;

  @OneToOne(() => MentoringLogs, MentoringLogs => MentoringLogs.id)
  mentoringLogs: MentoringLogs;
}
