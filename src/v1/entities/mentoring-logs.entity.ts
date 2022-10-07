import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cadets } from './cadets.entity';
import { Mentors } from './mentors.entity';
import { Reports } from './reports.entity';

@Entity()
export class MentoringLogs {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Mentors, Mentors => Mentors.mentoringLogs)
  mentors: Mentors;

  @ManyToOne(() => Cadets, Cadets => Cadets.mentoringLogs)
  cadets: Cadets;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @Column({ type: 'timestamptz', nullable: true, array: true })
  meetingAt: Date[];

  @Column({ type: 'timestamptz', nullable: true })
  meetingStart: Date;

  @Column({ type: 'varchar', length: 100 })
  topic: string;

  @Column({ type: 'varchar', length: 1000 })
  content: string;

  @Column({ type: 'varchar', length: 10 })
  status: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  rejectMessage: string;

  @Column({ type: 'timestamptz', array: true })
  requestTime1: Date[];

  @Column({ type: 'timestamptz', nullable: true, array: true })
  requestTime2: Date[];

  @Column({ type: 'timestamptz', nullable: true, array: true })
  requestTime3: Date[];

  @OneToOne(() => Reports, Reports => Reports.mentoringLogs)
  reports: Reports;
}
