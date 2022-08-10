import { MentorsInterface } from 'src/v1/interface/mentors/mentors.interface';
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
    const mentorData : MentorsInterface= {
      intraId: 'm-dada',
      name: '맥밀러',
      profileImage:
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      availableTime: '오전 10시 ~ 오후 6시',
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
