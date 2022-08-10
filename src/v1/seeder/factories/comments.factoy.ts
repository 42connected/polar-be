import { Comments } from '../../entities/comments.entity';
import { setSeederFactory } from 'typeorm-extension';
import { CommentsInterface } from 'src/v1/interface/comments/comments.interface';

export default setSeederFactory(Comments, faker => {
  const comments = new Comments();

  comments.content = faker.name.firstName('male');
  comments.content = faker.word.noun(200);
  return comments;
});
