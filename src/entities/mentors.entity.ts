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

  @Column({ nullable: false, length: 15 })
  intraId: string;

  @Column({ nullable: false, length: 10 })
  name: string;

  @Column({ length: 1000 })
  profileImage: string;

  @Column({ type: 'time', array: true, default: [[]] })
  availabeTime: Date[][];

  @Column({ length: 150 })
  introduction: string;

  @Column({ nullable: false })
  isActive: boolean;

  @Column({ length: 10000 })
  markdownContent: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
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
