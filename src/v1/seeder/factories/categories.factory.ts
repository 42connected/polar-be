import { Categories } from '../../entities/categories.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Categories, faker => {
  const categories = new Categories();

  categories.name = faker.name.firstName();
  return categories;
});
