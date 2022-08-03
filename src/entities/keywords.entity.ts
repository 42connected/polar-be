import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MentorKeywords } from './mentor-keywords.entity';

@Entity()
export class Keywords {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, length: 15 })
  name: string;

  @OneToMany(() => MentorKeywords, MentorKeywords => MentorKeywords.keywords)
  mentorKeyowrds: MentorKeywords[];
}
