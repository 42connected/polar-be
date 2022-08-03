import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Keywords } from './keywords.entity';
import { Mentors } from './mentors.entity';

@Entity()
export class MentorKeywords {
  @PrimaryColumn('uuid')
  mentorId: string;

  @PrimaryColumn('uuid')
  keywordId: string;

  @ManyToOne(() => Keywords, Keywords => Keywords.id)
  @JoinColumn({ name: 'keywordId' })
  keywords: Keywords;

  @ManyToOne(() => Mentors, Mentors => Mentors.id)
  @JoinColumn({ name: 'mentorId' })
  mentors: Mentors;
}
