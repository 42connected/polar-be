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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Mentors, Mentors => Mentors.mentoringLogs)
  mentors: Mentors;

  @ManyToOne(() => Cadets, Cadets => Cadets.mentoringLogs)
  cadets: Cadets;

  @Column()
  meetingAt: Date;

  @Column({ nullable: false, length: 100 })
  topic: string;

  @Column({ nullable: false, length: 1000 })
  content: string;

  @Column({ nullable: false, length: 10 })
  status: string;

  @Column({ length: 500 })
  rejectMessage: string;

  @Column({ nullable: false, length: 10 })
  reportStatus: string;

  @Column({ nullable: false })
  requestTime1: Date;

  @Column()
  requestTime2: Date;

  @Column()
  requestTime3: Date;

  @OneToOne(() => Reports, Reports => Reports.mentors)
  @JoinColumn()
  reports: Reports;
}
