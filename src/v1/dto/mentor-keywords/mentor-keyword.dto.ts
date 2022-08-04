import { MentorDto } from '../mentors/mentor.dto';

export interface MentorKeywordDto {
  mentorId: string;
  keywordId: string;
  keywords: MentorKeywordDto;
  mentors: MentorDto;
}
