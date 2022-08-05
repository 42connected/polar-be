import { Keywords } from 'src/entities/keywords.entity';
import { MentorsListElement } from './mentors-list-element.interface';

export interface MentorsList {
  keyword?: Keywords;
  mentorCount: number;
  mentors: MentorsListElement[];
}
