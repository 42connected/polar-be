import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Admins } from '../entities/admins.entity';

export class AdminSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const adminRepository = dataSource.getRepository(Admins);
    console.log('Seeding admins...');
    const adminData = {
      intraId: 'tototo',
      name: '주종현',
      profileImage:
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      isCommon: true,
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
