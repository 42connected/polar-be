import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Keywords } from '../entities/keywords.entity';

export class KeywordsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const keywordRepository = dataSource.getRepository(Keywords);
    console.log('Seeding keywords...');
    const keywordData = {
      name: '주종현',
      //mentorKeyowrds: 'keywords',
    };

    const newKeyword = keywordRepository.create(keywordData);
    await keywordRepository.save(newKeyword);
  }
}
