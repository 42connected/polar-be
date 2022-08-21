import { KeywordsInterface } from 'src/v1/interface/keywords/keywords.interface';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Keywords } from '../../entities/keywords.entity';

export class KeywordsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const keywordRepository = dataSource.getRepository(Keywords);
    console.log('Seeding keywords...');

    const keywordList: string[] = [
      '진로상담',
      '대기업',
      '해외',
      '스타트업',
      '취업상담',
      '창업',
      '협업',
      '프로젝트관리',
      '코드 최적화',
      '기획',
      '데이터 분석',
      'DB설계',
      '디자인',
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
      'AR / VR',
      '보안',
      '블록체인',
      '네트워크',
      'AI',
      '오픈소스',
      '이커머스',
      '알고리즘',
      '특허',
      '금융',
      '의료',
      '오픈소스',
      '이커머스',
      '알고리즘',
      '특허',
      '금융',
      '의료',
      'OS',
    ];
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
