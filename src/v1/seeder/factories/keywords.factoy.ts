import { setSeederFactory } from 'typeorm-extension';
import { Keywords } from '../../entities/keywords.entity';

export default setSeederFactory(Keywords, faker => {
  const keywords = new Keywords();

  keywords.name = faker.lorem.word();
  return keywords;
});
