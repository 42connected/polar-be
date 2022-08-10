import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Mentors } from '../../entities/mentors.entity';

export class MentorsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const mentorRepository = dataSource.getRepository(Mentors);
    console.log('Seeding mentors...');
    const mentorData = {
      intraId: 'm-engeng',
      name: '구창모',
      profileImage:
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      availability: '오전 10시 ~ 오후 6시',
      isActive: true,
    };
    const isExists = await mentorRepository.findOneBy({
      intraId: mentorData.intraId,
    });
    if (!isExists) {
      const newUser = mentorRepository.create(mentorData);
      await mentorRepository.save(newUser);
    }
  }
}
