import { Cadets } from '../../entities/cadets.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Cadets, faker => {
  const cadets = new Cadets();

  cadets.name = faker.name.firstName('male');
  cadets.intraId = faker.name.lastName('male');
  cadets.profileImage = faker.image.avatar();
  cadets.isCommon = faker.datatype.boolean();
  cadets.resumeUrl = faker.internet.url();
  cadets.updatedAt = faker.date.soon();
  cadets.email = faker.internet.email();
  return cadets;
});
