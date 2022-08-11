import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.entity';
import { MentoringLogs } from './mentoring-logs.entity';
import { Reports } from './reports.entity';

@Entity()
export class Cadets {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15 })
  intraId: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  profileImage: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  resumeUrl: string;

  @Column({ type: 'boolean' })
  isCommon: boolean;

  @Column({ type: 'varchar', length: 100 })
  cadetEmail: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => Comments, Comments => Comments.cadets)
  comments: Comments[];

  @OneToMany(() => MentoringLogs, MentoringLogs => MentoringLogs.cadets)
  mentoringLogs: MentoringLogs[];

  @OneToMany(() => Reports, Reports => Reports.cadets)
  reports: Reports[];
}
