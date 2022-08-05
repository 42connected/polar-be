import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Keywords } from './keywords.entity';
import { Mentors } from './mentors.entity';

@Entity()
export class MentorKeywords {
  @PrimaryColumn('uuid', { name: 'mentor_id' })
  mentorId: string;

  @PrimaryColumn('uuid', { name: 'keyword_id' })
  keywordId: string;

  @ManyToOne(() => Keywords, Keywords => Keywords.id)
  @JoinColumn({ name: 'keyword_id' })
  keywords: Keywords;

  @ManyToOne(() => Mentors, Mentors => Mentors.id)
  @JoinColumn({ name: 'mentor_id' })
  mentors: Mentors;
}
