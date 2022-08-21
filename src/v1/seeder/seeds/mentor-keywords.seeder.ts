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
    const mentorKeywords02: string[] = [
      'AI',
      'IoT',
      'SW아키텍쳐',
      '데이터 분석',
    ];
    mentorKeywordsList.push(mentorKeywords02);
    const mentorKeywords03: string[] = [
      'AI',
      'IoT',
      'SW아키텍쳐',
      '창업',
      '협업',
      '프로젝트관리',
    ];
    mentorKeywordsList.push(mentorKeywords03);
    const mentorKeywords04: string[] = [
      '서버',
      '협업',
      '프로젝트관리',
      '진로상담',
      '대기업',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords04);
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
