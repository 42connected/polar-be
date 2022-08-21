import { MentorsInterface } from 'src/v1/interface/mentors/mentors.interface';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Mentors } from '../../entities/mentors.entity';

export class MentorsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const mentorRepository = dataSource.getRepository(Mentors);
    console.log('Seeding mentors...');
    const mentorDataList: MentorsInterface[] = [];

    const mentorData01: MentorsInterface = {
      intraId: 'm-nkang',
      name: '강남석',
      profileImage:
        'https://ca.slack-edge.com/T039P7U66-U03E55DSV3J-g5a8e515d22b-512',
      availableTime: null,
      isActive: false,
      markdownContent: `
자기소개

- 42서울 1기 1차 최고령 Cadet
- 공인회계사
- 창업 실패 경험 有
- 핀테크 스타트업 CFO, CLSA 파트너십 체결, 내부통제 및 업무 자동화, 229억원 규모 시리즈B 펀딩
- 모바일 광고 스타트업 CFO, 코스닥 IPO 완료, 재무, 경영관리, IR, 법무, 인사 총괄
- 삼일회계법인 IT 전문 회계사로서 M&A 및 DDR, IPO, valuation 자문, ERP업무 경험 다수
- 상장사 M&A 자문 및 실사, 상장실질심사 지원, IPO 자문 등 상장 및 상장유지 관련 업무 경력 보유

주요분야

- 창업, 투자유치
- 사업모델
- 원가분석

주요경력

- ’21.03~현재	중고나라	CFO
- ’17.02~’20.05	피플펀드컴퍼니 CFO
- ’14.08~’17.01	퓨쳐스트림네트웍스 CFO, 코스닥 상장
- ‘11.06~’14.08	삼일회계법인	M&A, 재무자문
- ‘04.07~’11.05	삼일회계법인	회계감사, 실사`,
    };
    mentorDataList.push(mentorData01);

    const mentorData02: MentorsInterface = {
      intraId: 'm-jbkang',
      name: '강진범',
      profileImage:
        'https://ca.slack-edge.com/T039P7U66-U02B7V0GY5D-924081851fd2-512',
      availableTime: null,
      isActive: false,
      markdownContent: `
## **강진범**

Slack : m-jbkang

자기소개

- 개발적인 부분이든, 데이터 분석이든, 인공지능 전반적인 부분이든 어떤것이든 물어보세요.
- 참여중인 github repo : 기업지원 때문에 다 private 이라... 딱 제 마음입니다.
- 정기적으로 기술교류를 하는 private 모임을 진행하는데, 친목도모겸 기술 트렌드 공유정도 하고 있어요.
- 페이스북 : [https://www.facebook.com/jinbeom.kang](https://www.facebook.com/jinbeom.kang)

주요분야

- 데이터분석, 머신러닝, 딥러닝, 심볼릭 추론
- SW아키텍처, SW테스트 등 SW품질

대외활동

- SW마에스트로 멘토
- 여러 해커톤 멘토 (서울시 서울이동통합서비스(Mass) 해커톤, 중앙대 다빈치 소프트웨어 해커톤 등)
- 디자인패턴, SW공학, 인공지능, 데이터분석 강의 (LG전자, 메타넷 등)

주요경력 : 2004년 ~ (16년차)

- 컴퓨터 공학박사 (세부전공: 인공지능, 인공지능 기술 논문 및 특허)
- LG전자 (Android Framework, GPU/Graphics, AI Adaptation, Six Sigma MBB)
- 신한은행 AI Lab (챗봇 기술 도입 및 전략 수립)
- 자이냅스 CTO (심볼릭 대화추론 챗봇, TTS, 화자인식 기술 개발, 사용화)

Cadet에게

- 고민이 많은 분들에게 함께 고민을 해결할 수 있었으면 좋겠어요.
- 개발자로서 갖춰야하는 역량을 넘어, 앞으로 이루어야 할 것에 대해 이야기 나누고 싶어요.
- 저희 회사는 자기주도적인 인력을 원해요. 자기주도적이기 위해서 스스로 목표를 세우고, 그 목표를 달성하기 위한 플랜을 세우고, 플랜을 수행하며 스스로 리뷰할수 있는 역량이 필요해요. 자세한 이야기는 만나서..`,
    };
    mentorDataList.push(mentorData02);

    const mentorData03: MentorsInterface = {
      intraId: 'm-???',
      name: '고지현',
      profileImage:
        'https://ca.slack-edge.com/T039P7U66-U02B7V0GY5D-924081851fd2-512',
      availableTime: null,
      isActive: false,
      markdownContent: `
# 고지현 멘토
 1
상태: 멘토링 가능
생성일: 2022년 8월 4일 오후 2:05
전문분야: AI, IoT, 라즈베리파이, 소프트웨어 공학, 아두이노, 창업, 프로젝트 관리`,
    };
    mentorDataList.push(mentorData03);

    const mentorData04: MentorsInterface = {
      intraId: 'm-tedkim',
      name: '김동수',
      profileImage:
        'https://ca.slack-edge.com/T039P7U66-U022M7R95HQ-20ddc5cc4ac8-512',
      availableTime: null,
      isActive: false,
      markdownContent: `
## **김동수**

Slack : m-tedkim

자기 소개

- 무엇이 있는지 몰라 헤매이는 시작하는 개발자에게 도움이 되는 선배가 되어 드립니다.
- 개발과 개발자로써의 고민상담도 할 수 있어요.
- 페이스북 : [https://www.facebook.com/ds5apn](https://www.facebook.com/ds5apn)

주요분야

- DevOps
- 협업잘하는 방법
- API 플랫폼
- AWS
- 시기에 맞는 적절한 기술 적용하기

대외활동

- 서강대 캡스톤 멘토
- 소프트웨어 중심대학 오픈핵 멘토
- 소프트웨어에 물들다 강사
- 목각코, 아재개발단

주요경력 : 2001년 ~ (20년차)

- 현재 엘핀 CTO
- 오아시스마켓 개발리드
- 마켓컬리 CTO
- 넥스트매치(아만다) CTO
- 지니뮤직(kt뮤직) 개발팀장 (DevOps, 개발, 협업문화)
- kth DevOps팀 팀장 (DevOps, DevOps 개발툴 개발, 개발인프라 개선)`,
    };
    mentorDataList.push(mentorData04);

    const mentorData52: MentorsInterface = {
      intraId: 'm-engeng',
      name: '정경호',
      profileImage:
        'https://ca.slack-edge.com/T039P7U66-U03DU1UN0P3-gc9a7b67d9c4-512',
      availableTime: null,
      isActive: false,
      markdownContent: `
## 정경호

Slack : engeng

자기소개

- 대기업을 다니다 스타트업에 매료되어 10년 정도 스타트업 업계에 있습니다. 변화가 많고 빠른 업계라서 이벤트가 많아 아직도 재밌게 일을 하고 있습니다.
- 창업 후 망해본 경험 다수 보유: 안전하게 시작하고, 안전하게? 망하는 방법 이야기 해줄 수 있습니다.
- 문제를 찾고 IT 기술로 검증할 수 있도록 기술과 관련된 초기 단계부터 서비스 운영까지 가이드 가능합니다.

주요분야

- Typescript, Javascript Backend 개발
- Spring Boot, Kotlin
- Android Native
- AWS, GCP
- 서비스 개발, 운영, 확장에 필요한 모든 Backend, Android, Frontend 에 대한 기술 일체

대외활동

- 해커톤 커뮤니티 위드캠프(With Camp) 설립 및 운영 (2016~2020)
- 드로이드 나이츠, Google Developer Group 발표 활동
- 정주영창업대회 수상

주요경력

- 2011~2012: 삼성전자 프린터 사업부 영상처리 랩
- 2012~: 3번 창업 및 스타트업 근무
- 2019~2021: 스타트업 남의집 프로젝트 외주 백엔드 개발
		- v0.1~v4.0 Spring Boot + Kotlin
		- Test Coverage 90%
- 2020~2021: AI 스타트업 아틀라스랩스 백엔드 개발
- 2021~2022: NFT 가치평가 스타트업 NFTBank 서비스팀 리더

Cadet에게

- 실패를 많이 해본 개발자, 창업자 입니다. 아직은 성공한 경험이 없지만, 제 주위엔 많아요. 하지만 그 성공한 사람들도 실패를 많이 해봤죠. 저의 성공은 “아직" 오지 않았다라고 생각합니다.
- 개발자가 스타트업 업계에서 창업을 하고 망하고 개발자로서, 리더로서 일하며 어떻게 성장하는지 말씀드릴 수 있을것 같아요.`,
    };
    mentorDataList.push(mentorData52);

    for (const mentorData of mentorDataList) {
      const newUser = mentorRepository.create(mentorData);
      await mentorRepository.save(newUser);
    }
  }
}
