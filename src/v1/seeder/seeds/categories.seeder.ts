import { Categories } from '../../entities/categories.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { CategoriesInterface } from 'src/v1/interface/categories/categories.interface';

export class CategoriesSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const categoryRepository = dataSource.getRepository(Categories);
    console.log('Seeding categories...');

    const categoriesList: CategoriesInterface[] = [
      { name: '취업' },
      { name: '창업' },
      { name: '협업' },
      { name: '기획' },
      { name: '개발' },
      { name: '전문분야' },
      { name: 'Tech' },
      { name: 'CS' },
    ];
    for (const categoryData of categoriesList) {
      const isExists = await categoryRepository.findOneBy({
        name: categoryData.name,
      });
      if (!isExists) {
        const newUser = categoryRepository.create(categoryData);
        await categoryRepository.save(newUser);
      }
    }
  }
}
