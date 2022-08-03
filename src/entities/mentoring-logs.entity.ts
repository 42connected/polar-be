import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cadets } from './cadets.entity';
import { Mentors } from './mentors.entity';
import { Reports } from './reports.entity';

@Entity()
export class MentoringLogs {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Mentors, Mentors => Mentors.mentoringLogs)
  mentors: Mentors;

  @ManyToOne(() => Cadets, Cadets => Cadets.mentoringLogs)
  cadets: Cadets;

  @Column({ type: 'timestamp' })
  meetingAt: Date;

  @Column({ type: 'varchar', nullable: false, length: 100 })
  topic: string;

  @Column({ type: 'varchar', nullable: false, length: 1000 })
  content: string;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  status: string;

  @Column({ type: 'varchar', length: 500 })
  rejectMessage: string;

  @Column({ nullable: false, length: 10 })
  reportStatus: string;

  @Column({ type: 'timestamp', nullable: false })
  requestTime1: Date;

  @Column({ type: 'timestamp' })
  requestTime2: Date;

  @Column({ type: 'timestamp' })
  requestTime3: Date;

  @OneToOne(() => Reports, Reports => Reports.mentors)
  @JoinColumn()
  reports: Reports;
}
