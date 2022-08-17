import { Categories } from '../../entities/categories.entity';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { CategoriesInterface } from 'src/v1/interface/categories/categories.interface';
import { Keywords } from '../../entities/keywords.entity';
import { KeywordCategories } from '../../entities/keyword-categories.entity';

export class KeywordCategoriesSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const categoryRepository = dataSource.getRepository(Categories);
    const keywordRepository = dataSource.getRepository(Keywords);
    const keywordCategoriesRepository =
      dataSource.getRepository(KeywordCategories);
    console.log('Seeding categories...');

    // const keywordId = await (await keywordRepository.findOneBy({ name: '전체' })).id;
    // const categoryId = await (await categoryRepository.findOneBy({ name: '전체' })).id;
    // const categoryData: CategoriesInterface = {
    //     name: '전체',
    // };
    //     const newUser = categoryRepository.create(categoryData);
    //     await categoryRepository.save(newUser);

    const keywordCategoriesFactory = await factoryManager.get(
      KeywordCategories,
    );
    const keywordsMeta = await keywordRepository.find();
    const categoriesMeta = await categoryRepository.find();
    await keywordCategoriesFactory.setMeta({ keywordsMeta, categoriesMeta });
    await keywordCategoriesFactory.saveMany(1);
  }
}
