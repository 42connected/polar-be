export interface MentorsList {
  keyword?: KeywordInfo;
  mentorCount: number;
  mentors: MentorsListElement[];
}

export interface MentorsListElement {
  mentor: MentorInfo;
  keywords: string[];
}

export interface MentorInfo {
  id: string;
  name: string;
  intraId: string;
}

export interface KeywordInfo {
  id: string;
  name: string;
}
