import { Comments } from '../../entities/comments.entity';
import { setSeederFactory } from 'typeorm-extension';
import { CommentsInterface } from 'src/v1/interface/comments/comments.interface';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';

interface CommentsFactoryMeta {
  cadetsMeta: Cadets[];
  mentorsMeta: Mentors[];
}

export default setSeederFactory(Comments, (faker, meta : CommentsFactoryMeta) => {
  const comments = new Comments();
  comments.cadets = meta.cadetsMeta[faker.datatype.number(meta.cadetsMeta.length - 1)];
  comments.mentors = meta.mentorsMeta[faker.datatype.number(meta.mentorsMeta.length - 1)];
  comments.content = faker.word.noun(200);
  return comments;
});
