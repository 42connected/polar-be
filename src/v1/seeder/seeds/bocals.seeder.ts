import { BocalsInterface } from 'src/v1/interface/bocals/bocals.interface';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Bocals } from '../../entities/bocals.entity';

export class BocalsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const bocalsRepository = dataSource.getRepository(Bocals);
    console.log('Seeding admins...');

    const bocalData: BocalsInterface = {
      intraId: 'super',
      name: '종현',
    };

    const isExists = await bocalsRepository.findOneBy({
      intraId: bocalData.intraId,
    });
    if (!isExists) {
      const newUser = bocalsRepository.create(bocalData);
      await bocalsRepository.save(newUser);
    }

    const bocalsFactory = await factoryManager.get(Bocals);
    await bocalsFactory.saveMany(3);
  }
}
