import { Categories } from '../../entities/categories.entity';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { CategoriesInterface } from 'src/v1/interface/categories/categories.interface';
import { Keywords } from '../../entities/keywords.entity';
import { KeywordCategories } from '../../entities/keyword-categories.entity';

export class KeywordCategoriesSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(Categories);
    const keywordRepository = dataSource.getRepository(Keywords);
    const keywordCategoriesRepository =
      dataSource.getRepository(KeywordCategories);
    console.log('Seeding keyword-categories...');

    const keywordList1: string[] = [
      '진로상담',
      '대기업',
      '해외',
      '스타트업',
      '취업상담',
    ];
    const keywordList2: string[] = ['창업', '특허'];
    const keywordList3: string[] = ['협업', '프로젝트관리', '코드최적화'];
    const keywordList4: string[] = [
      '기획',
      '데이터분석',
      'DB설계',
      'SW아키텍쳐',
      '디자인',
    ];
    const keywordList5: string[] = [
      '프론트엔드',
      '백엔드',
      'iOS',
      '안드로이드',
      'SW아키텍쳐',
      '클라우드',
      '컨테이너',
      '서버',
      '게임',
      'IoT',
      '그래픽스',
      '컴퓨터비전',
      'AR/VR',
      'DB설계',
      'AI',
      '코드최적화',
    ];
    const keywordList6: string[] = [
      '블록체인',
      '네트워크',
      'AI',
      '오픈소스',
      'IoT',
      '클라우드',
      '그래픽스',
      '컴퓨터비전',
      'AR/VR',
      '이커머스',
      '보안',
      '서버',
      '컨테이너',
      '데이터분석',
    ];
    const keywordList7: string[] = [
      '알고리즘',
      '네트워크',
      'SW아키텍쳐',
      '운영체제',
      '서버',
      '보안',
      'DB설계',
    ];
    const keywordList8: string[] = ['금융', '의료', '이커머스', '로봇'];

    const categoryId1 = await categoryRepository.findOne({
      select: { id: true },
      where: { name: '취업' },
    });
    for (const keywordData of keywordList1) {
      const keywordId = await keywordRepository.findOne({
        select: { id: true },
        where: { name: keywordData },
      });
      const newData = keywordCategoriesRepository.create({
        keywords: keywordId,
        categories: categoryId1,
      });
      await keywordCategoriesRepository.save(newData);
    }

    const categoryId2 = await categoryRepository.findOne({
      select: { id: true },
      where: { name: '창업' },
    });
    for (const keywordData of keywordList2) {
      const keywordId = await keywordRepository.findOne({
        select: { id: true },
        where: { name: keywordData },
      });
      const newData = keywordCategoriesRepository.create({
        keywords: keywordId,
        categories: categoryId2,
      });
      await keywordCategoriesRepository.save(newData);
    }
    const categoryId3 = await categoryRepository.findOne({
      select: { id: true },
      where: { name: '협업' },
    });
    for (const keywordData of keywordList3) {
      const keywordId = await keywordRepository.findOne({
        select: { id: true },
        where: { name: keywordData },
      });
      const newData = keywordCategoriesRepository.create({
        keywords: keywordId,
        categories: categoryId3,
      });
      await keywordCategoriesRepository.save(newData);
    }
    const categoryId4 = await categoryRepository.findOne({
      select: { id: true },
      where: { name: '기획' },
    });
    for (const keywordData of keywordList4) {
      const keywordId = await keywordRepository.findOne({
        select: { id: true },
        where: { name: keywordData },
      });
      const newData = keywordCategoriesRepository.create({
        keywords: keywordId,
        categories: categoryId4,
      });
      await keywordCategoriesRepository.save(newData);
    }

    const categoryId5 = await categoryRepository.findOne({
      select: { id: true },
      where: { name: '개발' },
    });
    for (const keywordData of keywordList5) {
      const keywordId = await keywordRepository.findOne({
        select: { id: true },
        where: { name: keywordData },
      });
      const newData = keywordCategoriesRepository.create({
        keywords: keywordId,
        categories: categoryId5,
      });
      await keywordCategoriesRepository.save(newData);
    }

    const categoryId6 = await categoryRepository.findOne({
      select: { id: true },
      where: { name: 'Tech' },
    });
    for (const keywordData of keywordList6) {
      const keywordId = await keywordRepository.findOne({
        select: { id: true },
        where: { name: keywordData },
      });
      const newData = keywordCategoriesRepository.create({
        keywords: keywordId,
        categories: categoryId6,
      });
      await keywordCategoriesRepository.save(newData);
    }

    const categoryId7 = await categoryRepository.findOne({
      select: { id: true },
      where: { name: 'CS' },
    });
    for (const keywordData of keywordList7) {
      const keywordId = await keywordRepository.findOne({
        select: { id: true },
        where: { name: keywordData },
      });
      const newData = keywordCategoriesRepository.create({
        keywords: keywordId,
        categories: categoryId7,
      });
      await keywordCategoriesRepository.save(newData);
    }

    const categoryId8 = await categoryRepository.findOne({
      select: { id: true },
      where: { name: '전문분야' },
    });
    for (const keywordData of keywordList8) {
      const keywordId = await keywordRepository.findOne({
        select: { id: true },
        where: { name: keywordData },
      });
      const newData = keywordCategoriesRepository.create({
        keywords: keywordId,
        categories: categoryId8,
      });
      await keywordCategoriesRepository.save(newData);
    }
  }
}
