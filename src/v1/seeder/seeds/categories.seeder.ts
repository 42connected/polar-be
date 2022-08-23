import { Categories } from '../../entities/categories.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import * as XLSX from 'xlsx';

export class CategoriesSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(Categories);
    console.log('Seeding categories...');

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
    resultSheet.map(e => {
      const newData = categoryRepository.create({
        name: e.category,
      });
      categoryRepository.save(newData);
    });
  }
}
