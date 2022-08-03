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

  @Column({ length: 15, nullable: false })
  intraId: string;

  @Column({ length: 10 })
  name: string;

  @Column({ nullable: false })
  isCommon: boolean;

  @Column({ length: 1000 })
  profileImage: string;

  @Column()
  deletedAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @OneToMany(() => Comments, Comments => Comments.cadets)
  comments: Comments[];

  @OneToMany(() => MentoringLogs, MentoringLogs => MentoringLogs.cadets)
  mentoringLogs: MentoringLogs[];

  @OneToMany(() => Reports, Reports => Reports.cadets)
  Reports: Reports[];
}
