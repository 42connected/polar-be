import { AdminsInterface } from 'src/v1/interface/admins/admins.interface';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Admins } from '../../entities/admins.entity';

export class AdminSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const adminRepository = dataSource.getRepository(Admins);
    console.log('Seeding admins...');
    const adminData : AdminsInterface= {
      intraId: 'tototo',
      name: '주종현',
    };

    const isExists = await adminRepository.findOneBy({
      intraId: adminData.intraId,
    });
    console.log(isExists);
    if (!isExists) {
      const newUser = adminRepository.create(adminData);
      await adminRepository.save(newUser);
    }
  }
}
