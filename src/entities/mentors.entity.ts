import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comments } from './comments.entity';
import { MentorKeywords } from './mentor-keywords.entity';
import { MentoringLogs } from './mentoring-logs.entity';
import { Reports } from './reports.entity';

@Entity()
export class Mentors {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false, length: 15 })
  intraId: string;

  @Column({ type: 'varchar', nullable: false, length: 10 })
  name: string;

  @Column({ type: 'varchar', length: 1000 })
  profileImage: string;

  @Column({ type: 'time', array: true, default: [[]] })
  availabeTime: Date[][];

  @Column({ type: 'varchar', length: 150 })
  introduction: string;

  @Column({ type: 'boolean', nullable: false })
  isActive: boolean;

  @Column({ type: 'varchar', length: 10000 })
  markdownContent: string;

  @CreateDateColumn({ type: 'timestamp', nullable: false })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: false })
  updatedAt: Date;

  @OneToMany(() => MentorKeywords, MentorKeywords => MentorKeywords.mentors)
  mentorKeyowrds: MentorKeywords[];

  @OneToMany(() => Comments, Comments => Comments.mentors)
  comments: Comments[];

  @OneToMany(() => Reports, Reports => Reports.mentors)
  reports: Reports[];

  @OneToMany(() => MentoringLogs, MentoringLogs => MentoringLogs.mentors)
  mentoringLogs: MentoringLogs[];
}
