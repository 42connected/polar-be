import { Cadets } from '../../entities/cadets.entity';
import { CadetsInterface } from 'src/v1/interface/cadets/cadets.interface';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Cadets, faker => {
  const cadets = new Cadets();

  cadets.name = faker.name.firstName('male');
  cadets.intraId = faker.name.lastName('male');
  cadets.profileImage = faker.image.avatar();
  cadets.isCommon = faker.datatype.boolean();
  return cadets;
});
