import { MentorsInterface } from 'src/v1/interface/mentors/mentors.interface';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Mentors } from '../../entities/mentors.entity';
import * as XLSX from 'xlsx';
import * as fs from 'fs';

export class MentorsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const mentorRepository = dataSource.getRepository(Mentors);
    console.log('Seeding mentors...');

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
    const mentorDataList: MentorsInterface[] = [];
    await Promise.all(
      resultSheet.map(async e => {
        const fileName =
          '/Users/park/NestJS/polar-be/src/v1/seeder/seeds/mentor-mds/' +
          e.name +
          '.md';
        const markdownContent = fs.readFileSync(fileName, 'utf8');
        const newData: MentorsInterface = {
          name: e.name,
          intraId: e.intraId,
          profileImage: e.profileImage,
          isActive: false,
          availableTime: null,
          markdownContent: markdownContent,
        };
        mentorDataList.push(newData);
      }),
    );
    for (const mentorData of mentorDataList) {
      const newUser = mentorRepository.create(mentorData);
      await mentorRepository.save(newUser);
    }
  }
}
