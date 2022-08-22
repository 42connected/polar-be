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
    const mentorKeywords05: string[] = ['프론트엔드', '스타트업', '취업상담'];
    mentorKeywordsList.push(mentorKeywords05);
    const mentorKeywords06: string[] = [
      '그래픽스',
      '진로상담',
      '대기업',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords06);
    const mentorKeywords07: string[] = [
      '안드로이드',
      'AI',
      '대기업',
      '진로상담',
      '취업상담',
      '협업',
    ];
    mentorKeywordsList.push(mentorKeywords07);
    const mentorKeywords08: string[] = [
      '기획',
      'DB설계',
      '코드 최적화',
      '클라우드',
      '대기업',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords08);
    const mentorKeywords09: string[] = ['IoT', '로봇', '기획'];
    mentorKeywordsList.push(mentorKeywords09);
    const mentorKeywords10: string[] = [
      'AR / VR',
      '컴퓨터비전',
      'SW아키텍쳐',
      '게임',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords10);
    const mentorKeywords11: string[] = [
      '안드로이드',
      'iOS',
      '프론트엔드',
      '백엔드',
      '알고리즘',
      'DB설계',
      '대기업',
    ];
    mentorKeywordsList.push(mentorKeywords11);
    const mentorKeywords12: string[] = [
      '협업',
      '프로젝트 관리',
      '컨테이너',
      '프론트엔드',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords12);
    const mentorKeywords13: string[] = [
      'SW아키텍쳐',
      '백엔드',
      '데이터 분석',
      '대기업',
      '코드 최적화',
      '취업상담',
    ];
    mentorKeywordsList.push(mentorKeywords13);
    const mentorKeywords14: string[] = ['창업', '특허', '스타트업', '창업'];
    mentorKeywordsList.push(mentorKeywords14);
    const mentorKeywords15: string[] = ['코드 최적화', 'iOS', '대기업'];
    mentorKeywordsList.push(mentorKeywords15);
    const mentorKeywords16: string[] = [
      'AI',
      '서버',
      '데이터분석',
      'DB설계',
      '금융',
      '이커머스',
      '대기업',
    ];
    mentorKeywordsList.push(mentorKeywords16);
    const mentorKeywords17: string[] = [
      'AI',
      '컴퓨터비전',
      '데이터 분석',
      '보안',
    ];
    mentorKeywordsList.push(mentorKeywords17);
    const mentorKeywords18: string[] = [
      '안드로이드',
      'iOS',
      '백엔드',
      '진로상담',
      '대기업',
      '스타트업',
      '취업상담',
    ];
    mentorKeywordsList.push(mentorKeywords18);
    const mentorKeywords19: string[] = [
      'DB설계',
      '네트워크',
      '보안',
      '블록체인',
      '데이터 분석',
      '코드 최적화',
      'AI',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords19);
    const mentorKeywords20: string[] = [
      '안드로이드',
      'iOS',
      '백엔드',
      '프론트엔드',
      '오픈소스',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords20);
    const mentorKeywords21: string[] = [
      '진로상담',
      '대기업',
      '스타트업',
      '취업상담',
      '백엔드',
    ];
    mentorKeywordsList.push(mentorKeywords21);
    const mentorKeywords22: string[] = [
      'IoT',
      'AI',
      '서버',
      '협업',
      '프로젝트 관리',
      '컴퓨터비전',
      '네트워크',
      '운영체제',
      '보안',
      '데이터 분석',
      '컨테이너',
      '클라우드',
    ];
    mentorKeywordsList.push(mentorKeywords22);
    const mentorKeywords23: string[] = [
      '클라우드',
      '프론트엔드',
      '백엔드',
      '금융',
      '대기업',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords23);
    const mentorKeywords24: string[] = [
      'AI',
      '서버',
      '협업',
      '프로젝트 관리',
      '클라우드',
      'DB설계',
      '데이터 분석',
      'SW아키텍쳐',
      '프론트엔드',
      '코드 최적화',
      '안드로이드',
      '대기업',
    ];
    mentorKeywordsList.push(mentorKeywords24);
    const mentorKeywords25: string[] = ['보안', '코드 최적화'];
    mentorKeywordsList.push(mentorKeywords25);
    const mentorKeywords26: string[] = [
      'SW아키텍쳐',
      '안드로이드',
      '클라우드',
      '협업',
      '백엔드',
      '컨테이너',
      '네트워크',
      '진로상담',
    ];
    mentorKeywordsList.push(mentorKeywords26);
    const mentorKeywords27: string[] = [
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
    mentorKeywordsList.push(mentorKeywords27);
    const mentorKeywords28: string[] = [
      'IoT',
      '협업',
      '운영체제',
      'SW아키텍쳐',
      '오픈소스',
      '해외',
    ];
    mentorKeywordsList.push(mentorKeywords28);
    const mentorKeywords29: string[] = [
      '서버',
      'DB설계',
      '블록체인',
      '협업',
      '프로젝트 관리',
      '컨테이너',
      '운영체제',
      '클라우드',
      '코드 최적화',
      '취업상담',
      '진로상담',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords29);
    const mentorKeywords30: string[] = ['AI', '보안', '해외', '창업'];
    mentorKeywordsList.push(mentorKeywords30);
    const mentorKeywords31: string[] = [
      '안드로이드',
      'iOS',
      '프론트엔드',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords31);
    const mentorKeywords32: string[] = [
      '데이터 분석',
      '협업',
      '백엔드',
      '운영체제',
      '서버',
    ];
    mentorKeywordsList.push(mentorKeywords32);
    const mentorKeywords33: string[] = [
      'AI',
      '백엔드',
      '프론트엔드',
      '창업',
      '컨테이너',
      '의료',
      '오픈소스',
      '딥러닝',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords33);
    const mentorKeywords34: string[] = [
      '창업',
      '특허',
      '기획',
      '취업상담',
      '협업',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords34);
    const mentorKeywords35: string[] = ['iOS'];
    mentorKeywordsList.push(mentorKeywords35);
    const mentorKeywords36: string[] = [
      '클라우드',
      '협업',
      '프로젝트 관리',
      '컨테이너',
      '운영체제',
      '오픈소스',
      '해외',
    ];
    mentorKeywordsList.push(mentorKeywords36);
    const mentorKeywords37: string[] = ['창업', '특허', '금융'];
    mentorKeywordsList.push(mentorKeywords37);
    const mentorKeywords38: string[] = [
      '프론트엔드',
      'DB설계',
      '데이터 분석',
      '서버',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords38);
    const mentorKeywords39: string[] = [
      '네트워크',
      '기획',
      '백엔드',
      '클라우드',
      '협업',
      '프로젝트관리',
      'SW아키텍쳐',
      '서버',
      '클라우드',
      '오픈소스',
      '해외',
      '대기업',
    ];
    mentorKeywordsList.push(mentorKeywords39);
    const mentorKeywords40: string[] = [
      '서버',
      '기획',
      '데이터 분석',
      '클라우드',
      'DB설계',
      '운영체제',
      'SW아키텍쳐',
      '금융',
      '백엔드',
      '협업',
      '프로젝트 관리',
      '이커머스',
      '대기업',
    ];
    mentorKeywordsList.push(mentorKeywords40);
    const mentorKeywords41: string[] = [
      '블록체인',
      '컨테이너',
      '운영체제',
      'SW아키텍쳐',
      '프론트엔드',
      '대기업',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords41);
    const mentorKeywords42: string[] = ['코드 최적화', '협업', 'IoT'];
    mentorKeywordsList.push(mentorKeywords42);
    const mentorKeywords43: string[] = [
      '컨테이너',
      '백엔드',
      '프론트엔드',
      '대기업',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords43);
    const mentorKeywords44: string[] = ['DB설계', '의료'];
    mentorKeywordsList.push(mentorKeywords44);
    const mentorKeywords45: string[] = [
      '서버',
      '백엔드',
      '프론트엔드',
      '네트워크',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords45);
    const mentorKeywords46: string[] = [
      '기획',
      '창업',
      '특허',
      '협업',
      '프로젝트 관리',
      '취업상담',
      '진로상담',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords46);
    const mentorKeywords47: string[] = [
      'AI',
      '데이터 분석',
      '클라우드',
      'SW아키텍처',
      '컨테이너',
      '블록체인',
      '협업',
      '대기업',
    ];
    mentorKeywordsList.push(mentorKeywords47);
    const mentorKeywords48: string[] = [
      '언어',
      '프론트엔드',
      'DB설계',
      '알고리즘',
      '대기업',
    ];
    mentorKeywordsList.push(mentorKeywords48);
    const mentorKeywords49: string[] = ['SW아키텍쳐', 'IoT', '대기업'];
    mentorKeywordsList.push(mentorKeywords49);
    const mentorKeywords50: string[] = ['AI', 'iOS', '스타트업', '대기업'];
    mentorKeywordsList.push(mentorKeywords50);
    const mentorKeywords51: string[] = [
      '백엔드',
      '서버',
      '창업',
      '대기업',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords51);
    const mentorKeywords52: string[] = ['iOS', '서버', '오픈소스', '대기업'];
    mentorKeywordsList.push(mentorKeywords52);
    const mentorKeywords53: string[] = [
      '백엔드',
      '협업',
      '해외',
      '창업',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords53);
    const mentorKeywords54: string[] = [
      'AI',
      '백엔드',
      '디자인',
      '데이터 분석',
      '기획',
      '창업',
      '취업상담',
      '진로상담',
    ];
    mentorKeywordsList.push(mentorKeywords54);
    const mentorKeywords55: string[] = [
      'SW아키텍쳐',
      '블록체인',
      '보안',
      '알고리즘',
      '프론트엔드',
      '백엔드',
      '안드로이드',
      '대기업',
    ];
    mentorKeywordsList.push(mentorKeywords55);
    const mentorKeywords56: string[] = [
      '프론트엔드',
      '백엔드',
      '서버',
      '데이터 분석',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords56);
    const mentorKeywords57: string[] = [
      '백엔드',
      '블록체인',
      '창업',
      '프론트엔드',
      '협업',
      '대기업',
    ];
    mentorKeywordsList.push(mentorKeywords57);
    const mentorKeywords58: string[] = [
      '백엔드',
      '프론트엔드',
      '창업',
      '대기업',
      '스타트업',
    ];
    mentorKeywordsList.push(mentorKeywords58);
    const mentorKeywords59: string[] = ['게임', '서버', '대기업'];
    mentorKeywordsList.push(mentorKeywords59);
    const mentorKeywords60: string[] = ['DB설계', '데이터 분석', '대기업'];
    mentorKeywordsList.push(mentorKeywords60);
    // ----------------------------------------------

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
