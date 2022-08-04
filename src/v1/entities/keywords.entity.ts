import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MentorKeywords } from './mentor-keywords.entity';

@Entity()
export class Keywords {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 15, unique: true })
  name: string;

  @OneToMany(() => MentorKeywords, MentorKeywords => MentorKeywords.keywords)
  mentorKeyowrds: MentorKeywords[];
}
