import { KeywordsInterface } from 'src/v1/interface/keywords/keywords.interface';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Keywords } from '../../entities/keywords.entity';

export class KeywordsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const keywordRepository = dataSource.getRepository(Keywords);
    console.log('Seeding keywords...');

    const keywordData: KeywordsInterface = {
      name: 'web',
    };

    const isExists = await keywordRepository.findOneBy({
      name: keywordData.name,
    });
    if (!isExists) {
      const newKeyword = keywordRepository.create(keywordData);
      await keywordRepository.save(newKeyword);
    }
    const keywordsFactory = await factoryManager.get(Keywords);
    await keywordsFactory.saveMany(3);
  }
}
