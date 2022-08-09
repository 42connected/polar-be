import { CadetsInterface } from '../cadets/cadets.interface';
import { MentorsInterface } from '../mentors/mentors.interface';

export interface CommentsInterface {
  mentors: MentorsInterface;
  cadets: CadetsInterface;
  content: string;
  isDeleted?: boolean;
  deletedAt: Date;
  createdAt: Date;
}
