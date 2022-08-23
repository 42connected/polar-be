import { Categories } from '../../entities/categories.entity';
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Keywords } from '../../entities/keywords.entity';
import { KeywordCategories } from '../../entities/keyword-categories.entity';
import * as XLSX from 'xlsx';

export class KeywordCategoriesSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(Categories);
    const keywordRepository = dataSource.getRepository(Keywords);
    const keywordCategoriesRepository =
      dataSource.getRepository(KeywordCategories);
    console.log('Seeding keyword-categories...');
    const mentorXLSX = XLSX.readFile(
      '/Users/park/NestJS/polar-be/src/v1/seeder/seeds/123.xlsx',
    );
    interface Data {
      category: string;
      keywords: string;
    }
    const sheetName = mentorXLSX.SheetNames[1];
    const resultSheet: Data[] = XLSX.utils.sheet_to_json(
      mentorXLSX.Sheets[sheetName],
    );

    const categoriesList: string[] = [];
    const keywordsList: string[][] = [];
    resultSheet.map(e => {
      const keywordsSplit = e.keywords.split(', ');
      keywordsList.push(keywordsSplit);
      categoriesList.push(e.category);
    });
    for (let i = 0; i < categoriesList.length; i++) {
      const categoryId = await categoryRepository.findOne({
        select: { id: true },
        where: { name: categoriesList[i] },
      });
      for (const keywordName of keywordsList[i]) {
        const keywordId = await keywordRepository.findOne({
          select: { id: true },
          where: { name: keywordName },
        });
        const newData = keywordCategoriesRepository.create({
          keywordId: keywordId.id,
          categoryId: categoryId.id,
        });
        await keywordCategoriesRepository.save(newData);
      }
    }
  }
}
