import {
  Column,
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

  @Column({ type: 'varchar', length: 15, nullable: false })
  intraId: string;

  @Column({ type: 'varchar', length: 10 })
  name: string;

  @Column({ type: 'varchar', length: 1000 })
  profileImage: string;

  @Column({ type: 'boolean', nullable: false })
  isCommon: boolean;

  @Column({ type: 'timestamp', nullable : true})
  deletedAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updateAt: Date;

  @OneToMany(() => Comments, Comments => Comments.cadets)
  comments: Comments[];

  @OneToMany(() => MentoringLogs, MentoringLogs => MentoringLogs.cadets)
  mentoringLogs: MentoringLogs[];

  @OneToMany(() => Reports, Reports => Reports.cadets)
  Reports: Reports[];
}
