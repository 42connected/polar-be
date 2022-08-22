import { KeywordsInterface } from 'src/v1/interface/keywords/keywords.interface';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Keywords } from '../../entities/keywords.entity';
import * as XLSX from 'xlsx';

export class KeywordsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const keywordRepository = dataSource.getRepository(Keywords);
    console.log('Seeding keywords...');

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
    const keywordsArray: string[] = [];
    resultSheet.map(e => {
      const keywords = e.keywords.split(', ');
      keywords.map(e => {
        keywordsArray.push(e);
      });
    });
    const keywordList = keywordsArray.filter(
      (v, i) => keywordsArray.indexOf(v) === i,
    );
    // console.log(keywordList.sort());
    for (const keywordData of keywordList) {
      const isExists = await keywordRepository.findOneBy({
        name: keywordData,
      });
      if (!isExists) {
        const newKeyword = keywordRepository.create({ name: keywordData });
        await keywordRepository.save(newKeyword);
      }
    }
  }
}
