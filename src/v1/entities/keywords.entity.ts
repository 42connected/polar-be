import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { KeywordGroups } from './keyword-groups.entity';
import { MentorKeywords } from './mentor-keywords.entity';

@Entity()
export class Keywords {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  name: string;

  @OneToMany(() => MentorKeywords, MentorKeywords => MentorKeywords.keywords)
  mentorKeyowrds: MentorKeywords[];

  @ManyToOne(() => KeywordGroups, KeywordGroups => KeywordGroups.keywords)
  keywordGroups: Keywords[];
}
