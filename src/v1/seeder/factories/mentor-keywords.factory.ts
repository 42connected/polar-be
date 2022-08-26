import { MentorKeywords } from '../../entities/mentor-keywords.entity';
import { setSeederFactory } from 'typeorm-extension';

interface MentorKeywordsInterface {
  mentorIdMeta: string[];
  keywordIdMeta: string[];
}

export default setSeederFactory(
  MentorKeywords,
  (faker, meta: MentorKeywordsInterface) => {
    const mentorKeywords = new MentorKeywords();

    mentorKeywords.mentorId =
      meta.mentorIdMeta[faker.datatype.number(meta.mentorIdMeta.length - 1)];
    mentorKeywords.keywordId =
      meta.keywordIdMeta[faker.datatype.number(meta.keywordIdMeta.length - 1)];
    return mentorKeywords;
  },
);
