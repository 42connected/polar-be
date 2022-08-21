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
    const mentorList: string[] = ['m-nkang', 'm-jbkang', 'm-???', 'm-tedkim'];
    const mentorKeywordsList = [];
    const mentorIdList: string[] = [];
    // ----------------------------------------------
    const mentorKeywords01: string[] = [
      '취업상담',
      '대기업',
      '스타트업',
      '창업',
      '특허',
      '금융',
    ];
    mentorKeywordsList.push(mentorKeywords01);
    // ----------------------------------------------
    for (const mentorIntraId of mentorList) {
      const mentorId = await mentorRepository.findOne({
        select: { id: true },
        where: { intraId: mentorIntraId },
      });
      mentorIdList.push(mentorId.id);
      console.log(mentorId);
    }
  }
}
