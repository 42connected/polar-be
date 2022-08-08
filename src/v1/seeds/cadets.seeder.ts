import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Cadets } from '../entities/cadets.entity';

export class CadetsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const cadetRepository = dataSource.getRepository(Cadets);
    console.log('Seeding cadets...');
    const cadetData = {
      intraId: 'tototo',
      name: '주종현',
      profileImage:
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      isCommon: true,
    };

    const isExists = await cadetRepository.findOneBy({
      intraId: cadetData.intraId,
    });
    if (!isExists) {
      const newUser = cadetRepository.create(cadetData);
      await cadetRepository.save(newUser);
    }
  }
}
