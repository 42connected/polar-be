import { Categories } from 'src/v1/entities/categories.entity';
import { MentorsListElement } from './mentors-list-element.interface';

export interface MentorsList {
  category?: Categories;
  mentorCount: number;
  mentors: MentorsListElement[];
}
