import { MentorKeywords } from '../../entities/mentor-keywords.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Mentors } from '../../entities/mentors.entity';
import { Keywords } from '../../entities/keywords.entity';
import { MentorKeywordsInterface } from 'src/v1/interface/mentor-keywords/mentor-keywords.interface';

export class MentorKeywordsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Seeding mentor-keywords...');
    const mentorRepository = dataSource.getRepository(Mentors);
    const mentorKeywordRepository = dataSource.getRepository(MentorKeywords);
    const keywordRepository = dataSource.getRepository(Keywords);
    const keywordId = await( await keywordRepository.findOneBy({
      name: 'web',
    })).id;
    const mentorId = await (await mentorRepository.findOneBy({ intraId: 'm-engeng' })).id;
    if (!keywordId || !mentorId) {
      console.log('Not found fk')
      return;
    }
    const keywordData: MentorKeywordsInterface = {
        mentorId,
        keywordId,
    }

    const isExists = await mentorKeywordRepository.findOneBy({
      mentorId,
      keywordId,
    });
    if (!isExists) {
      const newKeyword = mentorKeywordRepository.create(keywordData);
      await mentorKeywordRepository.save(newKeyword);
    }
  }
}
