import { CommentsInterface } from 'src/v1/interface/comments/comments.interface';
import { MentorsInterface } from 'src/v1/interface/mentors/mentors.interface';
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

    // --- 테스트용 ---
    const mentors: MentorsInterface = await mentorRepository.findOneBy({
      intraId: 'm-dada',
    });
    const cadets = await cadetRepository.findOneBy({ intraId: 'nakkim' });
    console.log('Seeding comments...');
    const commentData: CommentsInterface = {
      mentors,
      cadets,
      content: '테스트',
    };
    const newUser = commentRepository.create(commentData);
    await commentRepository.save(newUser);
    // ------------

    const commentsFactory = await factoryManager.get(Comments);
    const cadetsMeta = await cadetRepository.find();
    const mentorsMeta = await mentorRepository.find();
    commentsFactory.setMeta({ cadetsMeta, mentorsMeta });
    await commentsFactory.saveMany(5);
  }
}
