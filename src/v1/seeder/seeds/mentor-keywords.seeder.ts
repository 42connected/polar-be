import { MentorKeywords } from '../../entities/mentor-keywords.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Mentors } from '../../entities/mentors.entity';
import { Keywords } from '../../entities/keywords.entity';
import { MentorKeywordsInterface } from 'src/v1/interface/mentor-keywords/mentor-keywords.interface';
import * as XLSX from 'xlsx';

export class MentorKeywordsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    console.log('Seeding mentor-keywords...');

    const mentorXLSX = XLSX.readFile(
      '/Users/park/NestJS/polar-be/src/v1/seeder/seeds/123.xlsx',
    );
    const sheetName = mentorXLSX.SheetNames[0];
    const resultSheet: Data[] = XLSX.utils.sheet_to_json(
      mentorXLSX.Sheets[sheetName],
    );
    interface Data {
      name: string;
      intraId: string;
      profileImage: string;
      keywords: string;
    }
    const mentorList: string[] = [];
    const mentorKeywordsList = [];
    resultSheet.map(e => {
      mentorList.push(e.intraId);
      const str = e.keywords.split(', ');
      mentorKeywordsList.push(str);
    });

    const mentorRepository = dataSource.getRepository(Mentors);
    const mentorKeywordRepository = dataSource.getRepository(MentorKeywords);
    const keywordRepository = dataSource.getRepository(Keywords);

    const mentorIdList: string[] = [];
    for (const mentorIntraId of mentorList) {
      const mentorId = await mentorRepository.findOne({
        select: { id: true },
        where: { intraId: mentorIntraId },
      });
      mentorIdList.push(mentorId.id);
    }

    let i = 0;
    for (const mentorId of mentorIdList) {
      while (i < mentorKeywordsList.length) {
        for (const keyword of mentorKeywordsList[i]) {
          const keywordId = await keywordRepository.findOne({
            select: { id: true },
            where: { name: keyword },
          });
          const newData = mentorKeywordRepository.create({
            keywordId: keywordId.id,
            mentorId: mentorId,
          });
          await mentorKeywordRepository.save(newData);
        }
        i++;
        break;
      }
    }
  }
}
