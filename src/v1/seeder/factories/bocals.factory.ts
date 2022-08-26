import { Bocals } from '../../entities/bocals.entity';
import { BocalsInterface } from 'src/v1/interface/bocals/bocals.interface';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Bocals, faker => {
  const bocals: BocalsInterface = new Bocals();

  bocals.name = faker.name.firstName('male');
  bocals.intraId = faker.name.lastName('male');
  return bocals;
});
