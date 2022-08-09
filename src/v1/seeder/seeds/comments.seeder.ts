import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Cadets } from '../../entities/cadets.entity';
import { Comments } from '../../entities/comments.entity';
import { Mentors } from '../../entities/mentors.entity';

export class CommentsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const commentRepository = dataSource.getRepository(Comments);
    const mentorRepository = dataSource.getRepository(Mentors);
    const cadetRepository = dataSource.getRepository(Cadets);

    const mentor = await mentorRepository.findOneBy({ intraId: 'm-engeng' });
    const cadet = await cadetRepository.findOneBy({ intraId: 'jojoo' });
    console.log('Seeding comments...');
    const commentData = {
      mentor,
      cadet,
      content: '안녕하세요! 좋은아침입니다.',
      //...
    };

    const newUser = commentRepository.create(commentData);
    await commentRepository.save(newUser);
  }
}
