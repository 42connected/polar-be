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

  @Column({ type: 'varchar', length: 15 })
  intraId: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  name: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  profileImage: string;

  @Column({ type: 'time', array: true, nullable: true })
  availableTime: Date[][2];

  @Column({ type: 'varchar', length: 150, nullable: true })
  introduction: string;

  @Column({ type: 'boolean' })
  isActive: boolean;

  @Column({ type: 'varchar', length: 10000, nullable: true })
  markdownContent: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
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
