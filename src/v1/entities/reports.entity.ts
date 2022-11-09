import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
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

  @Column({ type: 'varchar', length: 500, nullable: true })
  extraCadets: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  place: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  topic: string;

  @Column({ type: 'varchar', length: 800, nullable: true })
  content: string;

  @Column({
    type: 'varchar',
    default: [],
    length: 1000,
    nullable: true,
    array: true,
  })
  imageUrl: string[];

  @Column({ type: 'varchar', length: 1000, nullable: true })
  signatureUrl: string;

  @Column({ type: 'varchar', length: 800, nullable: true })
  feedbackMessage: string;

  @Column({ type: 'smallint', nullable: true })
  feedback1: number;

  @Column({ type: 'smallint', nullable: true })
  feedback2: number;

  @Column({ type: 'smallint', nullable: true })
  feedback3: number;

  @Column({ type: 'int', nullable: true })
  money: number;

  @Column({ length: 10 })
  status: string;

  @Column({ type: 'varchar', default: [], array: true, length: 1000 })
  history: string[];

  @OneToOne(() => MentoringLogs, MentoringLogs => MentoringLogs.id)
  @JoinColumn()
  mentoringLogs: MentoringLogs;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
