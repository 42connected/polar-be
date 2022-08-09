import { KeywordsInterface } from "../keywords/keywords.interface";
import { MentorsInterface } from "../mentors/mentors.interface";

export interface MentorKeywordsInterface {
    mentorId: string;
    keywordId: string;
    keywords: KeywordsInterface;
    mentors: MentorsInterface;
}
     