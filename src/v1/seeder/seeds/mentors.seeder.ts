import { MentorsInterface } from 'src/v1/interface/mentors/mentors.interface';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Mentors } from '../../entities/mentors.entity';
import * as XLSX from 'xlsx';

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
    resultSheet.map(e => {
      const newData: MentorsInterface = {
        name: e.name,
        intraId: e.intraId,
        profileImage: e.profileImage,
        isActive: false,
        availableTime: null,
        markdownContent: null,
      };
      mentorDataList.push(newData);
    });
    for (const mentorData of mentorDataList) {
      const newUser = mentorRepository.create(mentorData);
      await mentorRepository.save(newUser);
    }
  }
}

//     const mentorData01: MentorsInterface = {
//     //       intraId: 'm-nkang',
//     //       name: '강남석',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U03E55DSV3J-g5a8e515d22b-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // 자기소개

//     // - 42서울 1기 1차 최고령 Cadet
//     // - 공인회계사
//     // - 창업 실패 경험 有
//     // - 핀테크 스타트업 CFO, CLSA 파트너십 체결, 내부통제 및 업무 자동화, 229억원 규모 시리즈B 펀딩
//     // - 모바일 광고 스타트업 CFO, 코스닥 IPO 완료, 재무, 경영관리, IR, 법무, 인사 총괄
//     // - 삼일회계법인 IT 전문 회계사로서 M&A 및 DDR, IPO, valuation 자문, ERP업무 경험 다수
//     // - 상장사 M&A 자문 및 실사, 상장실질심사 지원, IPO 자문 등 상장 및 상장유지 관련 업무 경력 보유

//     // 주요분야

//     // - 창업, 투자유치
//     // - 사업모델
//     // - 원가분석

//     // 주요경력

//     // - ’21.03~현재	중고나라	CFO
//     // - ’17.02~’20.05	피플펀드컴퍼니 CFO
//     // - ’14.08~’17.01	퓨쳐스트림네트웍스 CFO, 코스닥 상장
//     // - ‘11.06~’14.08	삼일회계법인	M&A, 재무자문
//     // - ‘04.07~’11.05	삼일회계법인	회계감사, 실사`,
//     //     };
//     //     mentorDataList.push(mentorData01);

//     //     const mentorData02: MentorsInterface = {
//     //       intraId: 'm-jbkang',
//     //       name: '강진범',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U02B7V0GY5D-924081851fd2-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // ## **강진범**

//     // Slack : m-jbkang

//     // 자기소개

//     // - 개발적인 부분이든, 데이터 분석이든, 인공지능 전반적인 부분이든 어떤것이든 물어보세요.
//     // - 참여중인 github repo : 기업지원 때문에 다 private 이라... 딱 제 마음입니다.
//     // - 정기적으로 기술교류를 하는 private 모임을 진행하는데, 친목도모겸 기술 트렌드 공유정도 하고 있어요.
//     // - 페이스북 : [https://www.facebook.com/jinbeom.kang](https://www.facebook.com/jinbeom.kang)

//     // 주요분야

//     // - 데이터분석, 머신러닝, 딥러닝, 심볼릭 추론
//     // - SW아키텍처, SW테스트 등 SW품질

//     // 대외활동

//     // - SW마에스트로 멘토
//     // - 여러 해커톤 멘토 (서울시 서울이동통합서비스(Mass) 해커톤, 중앙대 다빈치 소프트웨어 해커톤 등)
//     // - 디자인패턴, SW공학, 인공지능, 데이터분석 강의 (LG전자, 메타넷 등)

//     // 주요경력 : 2004년 ~ (16년차)

//     // - 컴퓨터 공학박사 (세부전공: 인공지능, 인공지능 기술 논문 및 특허)
//     // - LG전자 (Android Framework, GPU/Graphics, AI Adaptation, Six Sigma MBB)
//     // - 신한은행 AI Lab (챗봇 기술 도입 및 전략 수립)
//     // - 자이냅스 CTO (심볼릭 대화추론 챗봇, TTS, 화자인식 기술 개발, 사용화)

//     // Cadet에게

//     // - 고민이 많은 분들에게 함께 고민을 해결할 수 있었으면 좋겠어요.
//     // - 개발자로서 갖춰야하는 역량을 넘어, 앞으로 이루어야 할 것에 대해 이야기 나누고 싶어요.
//     // - 저희 회사는 자기주도적인 인력을 원해요. 자기주도적이기 위해서 스스로 목표를 세우고, 그 목표를 달성하기 위한 플랜을 세우고, 플랜을 수행하며 스스로 리뷰할수 있는 역량이 필요해요. 자세한 이야기는 만나서..`,
//     //     };
//     //     mentorDataList.push(mentorData02);

//     //     const mentorData03: MentorsInterface = {
//     //       intraId: 'm-???',
//     //       name: '고지현',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U02B7V0GY5D-924081851fd2-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // # 고지현 멘토
//     //  1
//     // 상태: 멘토링 가능
//     // 생성일: 2022년 8월 4일 오후 2:05
//     // 전문분야: AI, IoT, 라즈베리파이, 소프트웨어 공학, 아두이노, 창업, 프로젝트 관리`,
//     //     };
//     //     mentorDataList.push(mentorData03);

//     //     const mentorData04: MentorsInterface = {
//     //       intraId: 'm-tedkim',
//     //       name: '김동수',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U022M7R95HQ-20ddc5cc4ac8-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // ## **김동수**

//     // Slack : m-tedkim

//     // 자기 소개

//     // - 무엇이 있는지 몰라 헤매이는 시작하는 개발자에게 도움이 되는 선배가 되어 드립니다.
//     // - 개발과 개발자로써의 고민상담도 할 수 있어요.
//     // - 페이스북 : [https://www.facebook.com/ds5apn](https://www.facebook.com/ds5apn)

//     // 주요분야

//     // - DevOps
//     // - 협업잘하는 방법
//     // - API 플랫폼
//     // - AWS
//     // - 시기에 맞는 적절한 기술 적용하기

//     // 대외활동

//     // - 서강대 캡스톤 멘토
//     // - 소프트웨어 중심대학 오픈핵 멘토
//     // - 소프트웨어에 물들다 강사
//     // - 목각코, 아재개발단

//     // 주요경력 : 2001년 ~ (20년차)

//     // - 현재 엘핀 CTO
//     // - 오아시스마켓 개발리드
//     // - 마켓컬리 CTO
//     // - 넥스트매치(아만다) CTO
//     // - 지니뮤직(kt뮤직) 개발팀장 (DevOps, 개발, 협업문화)
//     // - kth DevOps팀 팀장 (DevOps, DevOps 개발툴 개발, 개발인프라 개선)`,
//     //     };
//     //     mentorDataList.push(mentorData04);

//     //     const mentorData05: MentorsInterface = {
//     //       intraId: 'm-ruby',
//     //       name: '김루비',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U03DHNUQE6Q-9970446b6186-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // ### 👋 Hello, 42 Cadet!

//     // 안녕하세요~ 2기 1차에 cadet으로 활동하다 현재는 외국계 스타트업에서 근무 중인 m-ruby 입니다 :-)

//     // 혹시라도 덕몽어스(구스구스덕) 좋아하시는 분들 중 같이 하실 분 DM주세요! (두근두근)

//     // ### 👣 발자취

//     // [ruby-kim - Overview](https://github.com/ruby-kim)

//     // 2022.01 - 현재 Sibel International(Sibel Health 한국 지부) 클라우드 엔지니어

//     // 2020.10 - 2022.01 42SEOUL 2기 1차 Cadet

//     // ### 👓  멘토링 주요분야

//     // - 신입(주니어) 개발자 취준법
//     // 		- Github 관리하기
//     // 	- 인턴 및 정규직 지원할 때 Github 덕분에 면접까지 간 경우가 꽤 있습니다✨
//     // 	- Github를 내 마음대로 신명나게 꾸미는 법을 알려드립니다.
//     // 		- 포트폴리오 준비 / 인성 면접
//     // 	- 자신의 장점을 극대화할 수 있는 방안에 대해 상담 해드립니다.
//     // 	- 면접 팁은 특히 저같은 선천적 내성적인 분들께 많이 도움이 될 것이라 생각해요.
//     // 	(MBTI가 I로 시작합니다 😌)
//     // 	- [참고] 기술 면접은 시니어 멘토님들께 여쭤보시는 것을 추천드려요! 물론 경험담 공유를 원하시면 언제든지 가능합니다 😊
//     // 		- 외국계 기업 준비
//     // 	- 국내에서 영어 회화 공부하기
//     // 	- 외국계 기업 찾기 & 준비법
//     // 	- 참고로 토종 한국인입니다. ***아이 라잌 코리아***  🇰🇷 *(펄럭)*
//     // - 개발하면서 생기는 고민들
//     // 		- 42 프로젝트 말고 뭔가 더 해야할까요?
//     // 		- 어느 정도 언어 문법 알겠는데, 뭘 더 해야할까요?
//     // 		- 프로젝트 어떻게 시작하나요?
//     // 		- 어느 분야(프론트, 데이터사이언스, 인공지능 등)로 가야할지 잘 모르겠어요
//     // 		- 개발자를 준비하면서 한 번 쯤 해봤던 고민들 같이 얘기해봐요!
//     // - 따끈한 취준 & 입사 썰 듣고 싶으신 분들도 환영합니다!
//     // 		- ex) 면접 중 인공 암벽장 간 썰
//     // 		- ex) MAGA, 네카라쿠배 중 일부 기업 면접 썰
//     // 		- ex) 내가 알던 사람이 회사 선배님의 친구?! 썰
//     // 		- ex) 연봉 협상 썰
//     // 		- ex) 대기업을 포기하고 스타트업으로 취직한 썰 등
//     // 		- 이 외에 다양한 썰이 있습니다 📦
//     // - 가벼운 일상부터 고민 거리까지 상담 가능합니다.
//     // 		- 대인관계 등, 카뎃분들도 각자의 사정이 있으실거라 생각해요.
//     // 		- 또 가끔은 외롭다고 생각이 드실 때가 있지 않으신가요?
//     // 		- 사람 대 사람으로 같이 천천히 티타임 가지면서 힐링하는 시간을 가져봐요 😇

//     // ### ❌ 아래 분야에 대해서는 멘토링 불가능합니다. 다른 시니어 멘토님께 연락해보세요!

//     // - 42서울 과제: 그 유명한, ‘왼쪽 보고 오른쪽 보자'로 동료 카뎃분들께 질문해보세요.
//     // - 먼 미래 진로고민
//     // 		- 2022년 1월에 입사한 따끈따끈 신입입니다.
//     // 		- 개발 직군 관련해서 먼 미래까지는 아직 무리에요 🥲
//     // - 기술 분야 상담 & 코드 리뷰: 개발자 짬이 차면 해드릴 수 있겠지만, 위에 적었듯이 따끈한 신입입니다 🐣`,
//     //     };
//     //     mentorDataList.push(mentorData05);

//     //     const mentorData06: MentorsInterface = {
//     //       intraId: 'm-deal',
//     //       name: '김민창',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U03D8P6NG4W-34b6938dd398-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // # 다시 만나서 반가워요!

//     // 안녕하세요. 42서울에서 여러분과 함께 공부하던 minckim입니다.

//     // 새 이름 **m-deal**로 다시 뵙게 되었습니다.

//     // ~~42Seoul에는 탱과 딜이 있습니다. 힐 한 분 오시면 바로 레이드 출발!~~

//     // # 자기 소개

//     // ### **😵** 42서울을 시작하기 전까지의 이야기

//     // [https://youtu.be/hQFuUF2BXZg](https://youtu.be/hQFuUF2BXZg)

//     // Q: 서른 한 살 아죠씨, 개발자가 되기에 늦지 않았을까요?

//     // A: 늦지 않은 것 같습니다!

//     // ### **🤤** 34살이... 신입?!

//     // - 도대체 이 나이 먹도록 뭘 한 거죠?

//     // 		20살에 건축학과 진학, 군대 2년, 건축설계사무터 인턴, 26살에 느닷없이 휴학하고 기술고시(행정고시 이과ver) 수험생활 2년, 와우(월드오브워크래프트)를 반 년(...), 감사직 공무원 수험생활을 반 년, 다시 복학해서 학교를 마무리 하고 나니 30살이 되던 해에 대학교를 졸업했습니다.

//     // 		1년 동안 시제품 제작 지원센터에서 일하면서 작품활동을 했습니다. 사직하고 1년동안 대학원에 진학하여 로봇을 건축에 활용하는 방법을 연구했습니다.

//     // 		그러던 중에 42서울을 알게 되어 지원했습니다. 42에서 2년간 개발자가 될 준비를 했고, 지금은 그래픽스 엔지니어가 되었습니다.

//     // 		나이가 많고 비전공이라 걱정인 분들께 저의 경험이 좋은 사례가 되었으면 좋겠습니다.

//     // ### **👶** 주니어 그래픽스 엔지니어

//     // C++와 수학을 활용하는 직무 위주로 구직하다보니, 그래픽스 엔지니어가 되었습니다.

//     // # 경력 사항

//     // - 현) 쉐이커미디어 그래픽스 엔지니어 (2022.01 ~ 현재)
//     // 		- 클라이언트 요청을 토대로 서버에서 영상을 생성하는 렌더러를 개발하고 있습니다.
//     // 		- OpenGL과 C++를 주로 사용합니다.
//     // - 전) 42Seoul 카뎃/피시너 (2020.01 ~ 2022.03)

//     // # 멘토링 주제

//     // ### **😀** 멘토링 가능한 주제와 대상

//     // - 취직준비
//     // 		- 따끈따끈한 C++ 개발자 기술 면접 단골 질문이 궁금하신 분
//     // 		- 면접 경험, 포트폴리오 작성 경험, 연봉 협상 경험이 궁금하신 분
//     // 		- 42과제가 취직할 때 얼마나 도움 되었는지 궁금하신 분
//     // - 주니어 개발자의 회사 적응기
//     // 		- 두근두근 첫 출근 이야기가 궁금하신 분
//     // 		- 내가 잘 할 수 있을지 궁금하신 분
//     // 		- 내가 과연 방대한 코드를 이해하고 적응할 수 있을지 궁금하신 분
//     // - 그래픽스
//     // 		- 그래픽스 엔지니어가 되는 방법이 궁금하신 분
//     // 		- 게임 그래픽에 관심있는 분
//     // 		- 그래픽스를 독학하는 중인데 도저히 이해도 안 되고 자료도 못 찾겠다는 분
//     // - 수학 공부 하는 법
//     // 		- FDF, Cub3D, MiniRT하는데, 수학에 발목을 잡히신 분
//     // - ~~밥좀 사주세요~~
//     // 		- ~~강남 물가가 너무 비싸서 맨 날 한솥도시락만 드시는 분~~
//     // 		- ~~공식적인 자리에서는 들을 수 없는 썰들이 궁금하신 분~~
//     // 		- ~~42서울의 라떼는 썰이 궁금하신 분~~
//     // 		- 비전공자, 나이가 걱정이신 분

//     // ### **😩** 도움을 드릴 수 없는 주제

//     // - 개발자 로드맵
//     // 		- 저도 아직은 잘 모릅니다😅
//     // - 과제에 대한 구체적인 도움
//     // 		- 에이... 잘 아시죠?ㅋㅋ
//     // - 알고리즘 코딩테스트 준비
//     // 		- 라이브코딩테스트를 통해 입사 했지만, 일반적인 알고리즘 코딩 테스트와는 결이 다른 것 같아요. 저는 큰 도움이 안 될 것 같아요.
//     // - 포트폴리오 첨삭
//     // 		- 다른 시니어 개발자 분들이 더 잘 봐주실 것 같습니다.
//     // 		- 다만 저의 경험에 대한 공유는 환영합니다.`,
//     //     };
//     //     mentorDataList.push(mentorData06);

//     //     const mentorData07: MentorsInterface = {
//     //       intraId: 'm-kbs',
//     //       name: '김범수',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U03E55DJA48-21a3c143a2d6-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // Slack : m-kbs

//     // - 자기소개
//     // 		- 지금은 NAVER CLOVA에서 AI와 Android 관련 업무를 하고 있어요
//     // 		- 어느덧 9년째 Android Application 을 개발하고 있는 개발자 입니다
//     // 		- 취미로 야구랑 LCK를 즐겨보고 있어요

//     // - 주요경력 (2014 ~ )
//     // 		- NAVER CLOVA - Android, AI 경량화
//     // 		- NAVER LABS - Android
//     // 		- SK Planet - Android, iOS

//     // - 참여 프로젝트
//     // 		- FaceSign 얼굴인식 - NAVER 신사옥 프로젝트
//     // 		- LINE CarNavi  - 일본 출시
//     // 		- AKI - 아기용 스마트 워치(폰)
//     // 		- HOTZIL - 서비스 종료 ㅠ_ㅠ
//     // 		- 5DUCKS - 서비스 종료 ㅠ_ㅠ
//     // 		- T Store (현 원스토어), T store books (현 원스토리)

//     // - 대외활동
//     // 		- NAVER DEVIEW 2021

//     // ### Cadet 분들에게

//     // 모바일 개발의 매력을 아시나요??

//     // 기획, 디자인, server, ai, BSP, HW, QA, 마케팅, 광고 분들까지 정말 다양한 분들과 밀접하게 협업할 일이 많아서 서비스 이해도가 높아지고 그만큼 많은 사람들과 친해지고 이야기하게 돼요.

//     // 내가 만든 신규 앱이 지하철 옆자리에 앉으신 분이 사용하고 있을 때의 짜릿함까지!

//     // 함께 삽질을 해보거나 같이 성장해가고 싶거나 그냥 푸념을 늘어놓고 싶으신분들 아니면 그냥 커피 얻어먹고 싶으신 분들 까지 모두 다 좋아요!`,
//     //     };
//     //     mentorDataList.push(mentorData07);

//     //     const mentorData08: MentorsInterface = {
//     //       intraId: '42_paulsjkim_mentor',
//     //       name: '김성조',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U02FQLMV3R8-2b4e0299fb59-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // ## **김성조**

//     // Slack : 42_paulsjkim_mentor

//     // 자기소개

//     // - 페이스북 : [https://www.facebook.com/Paul.S.J.Kim](https://www.facebook.com/Paul.S.J.Kim)
//     // - 엉덩이로 코딩하는 개발자, 내게 쉬우면 남도 쉽다.
//     // - 하나의 주제로 설치형 패키지, 오픈소스, SaaS형 서비스를 개발하며 15년이상의 경험을 가지고 있습니다. 꼭 개발이 아니더라도 B2B 솔루션 분야에서는 마켓팅이나 사업을 시작하는 부분에서도 공유할 수있는 경험이 있을 듯 합니다.

//     // 직장경력 : 1998년 ~ (22년차)

//     // - 와탭랩스 CTO (와탭 APM/SaaS 개발)
//     // - 제니퍼소프트 CTO (제니퍼 APM개발)
//     // - LG CNS 최적화팀(성능 튜닝, 프레임웍 개발)

//     // 주요분야

//     // - 성능 튜닝, 솔루션 개발
//     // - Java BCI, File DB
//     // - 모니터링 서비스(SaaS)개발

//     // 대외활동

//     // - Scouter`,
//     //     };
//     //     mentorDataList.push(mentorData08);

//     //     const mentorData09: MentorsInterface = {
//     //       intraId: 'm-sulac',
//     //       name: '김윤래',
//     //       profileImage: null,
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // 자기 소개 : [https://github.com/younlea/WHOAMI-HANGUL-](https://github.com/younlea/WHOAMI-HANGUL-)

//     // slack ID : m-sulac

//     // 개인 블로그 : [http://sulac.egloos.com/](http://sulac.egloos.com/)`,
//     //     };
//     //     mentorDataList.push(mentorData09);

//     //     const mentorData10: MentorsInterface = {
//     //       intraId: 'm-jfeel',
//     //       name: '김종필',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U02BNM41F7U-e5dc25ce105c-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // ## **김종필**

//     // Slack : m-jongfeel-kim

//     // 자기소개

//     // - AR(Augmented Reality), DT(Digital Twin) 전문 기업 버넥트에서 Make/View 및 Remote hololens 등의 유니티 기반 **제품 개발 팀장** 및 **테크니컬 리드**를 맡고 있습니다.
//     // - 하는 일과 달리 주요 관심 분야는 소프트웨어 장인정신, 객체지향 분석/설계, 테스트 자동화와 CI/CD, 양자컴퓨팅(?) 등입니다.
//     // - 개인 멘토링 활동도 진행하고 있으며, 개인 소프트웨어 커뮤니티도 있어서 여러 멘티 분들과 소프트웨어의 가치에 대해 공부하고 토론합니다.
//     // - 개인 github

//     // 		[jongfeel - Overview](https://github.com/jongfeel)

//     // - 개인 멘토링 github organization

//     // 		[Feel's software development mentoring](https://github.com/ThinkAboutSoftware)

//     // 주요분야

//     // - Unity를 기반으로 한 AR/VR/XR/MR 기술을 토대로 한 Multiplatform(UWP, Android, iOS) 제품 개발
//     // - .NET 위에서 C#으로 개발 가능한 모든 종류의 소프트웨어
//     // - 소프트웨어 고전 책에 대한 열띤 토론(고전 독서토론회, 학술회의 등 진행)
//     // - 가끔 Javascript frontend, backend 기술 리뷰

//     // 대외활동

//     // - Feel's software development mentoring ([github.com](https://github.com/ThinkAboutSoftware))
//     // 		1. 온라인 모각코: 매주 토요일 오전 10:30 ~ 12:30, 2021년 9월 기준 40회 이상 연속 진행
//     // 		2. 1:1 혹은 팀 멘토링: 2주 간격으로 지속적인 대화를 통한 방향성 잡기와 코드 리뷰
//     // 		3. 행사
//     // 	1. 학술 회의, 매년 2월 ~ 6월 진행, 소프트웨어 관련된 책 읽고 리뷰 및 토론
//     // 	2. 홈 커밍 데이, 매년 12월 셋째주 주말, 2021년 12월 18일 토요일 세번째 개최 예정
//     // - 한이음 ICT 멘토 (2018 ~ 현재)
//     // - 고등학생 대상 프로그래머 직업인 소개 강사 (2019 ~ 현재): 연 2~5회
//     // - GDG 인천, 송도 등에서 개발자 커뮤니티 활동
//     // - 교육하는 사람들 커뮤니티 활동
//     // - 하드코딩하는 사람들 커뮤니티 활동 (2018, 2019 연말 세미나 발표)
//     // - Mixed Reality 관련 open source 활동
//     // - KAIST 대학원생 대상 MixedReality와 WebRTC 기술에 대한 특강 진행 (2021)

//     // 주요경력 2004년 ~ (17년차), 버넥트에서 최근 5개까지 한 프로젝트

//     // - 팀내 Unity 공통 모듈 개발 및 모듈 패키지 배포를 위한 CI/CD 구축 (with github action), 2021
//     // - KT wearable 프로젝트, 2021
//     // - Remote Hololens 1.0, 2.0 제품 개발, 2020 ~ 2021
//     // - 황룡사 복원 사업 개발, 2019
//     // - 한전 연구과제, AR 앱 개발, 2018 ~ 2019
//     // - 그외 5개 회사에서 약 40개 이상의 SI 프로젝트 및 제품 개발 프로젝트 진행
//     // - 이력서 링크 (영문)

//     // 		[Indeed Resume](https://my.indeed.com/p/KimJ-ongFeel)

//     // Cadet에게

//     // - 주로 제가 찾아가서 대화 하고 교육생 분들이 관심 있는 것 하고 싶은 것 위주로 조언해주고 할 예정입니다.
//     // - AR, MR 같은 기술이나 Hololens2, Oculus quest2 등의 디바이스로 뭔가 만들고 싶은 것에 관심이 있으시면 얘기해 주세요
//     // - 소프트웨어를 만든다는 것의 의미와 가치를 배우고 싶으시다면 저와 열띤 토론을 해주시면 좋습니다.
//     // - 가장 완성도 있고 좋은 프로그래밍 언어라고 생각하지만 우리나라에서는 유독 외면 받는 C#에 대해 알고 싶으시면 저와 함께하시면 좋습니다.`,
//     //     };
//     //     mentorDataList.push(mentorData10);

//    //  // const mentorData11: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData11);

//    //  // const mentorData12: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData12);

//    //  // const mentorData13: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData13);

//    //  // const mentorData14: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData14);

//    //  // const mentorData15: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData15);

//    //  // const mentorData16: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData16);

//    //  // const mentorData17: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData17);

//    //  // const mentorData18: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData18);

//    //  // const mentorData19: MentorsInterface = {
//     // //   intraId: '',
//    //  //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//    //  //   isActive: false,
//    //  //   markdownContent: ``,
//     // // };
//     // // mentorDataList.push(mentorData19);

//    //  // const mentorData20: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData20);

//    //  // const mentorData21: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData21);

//    //  // const mentorData22: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData22);

//    //  // const mentorData23: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData23);

//    //  // const mentorData24: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData24);

//    //  // const mentorData25: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData25);

//    //  // const mentorData26: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData26);

//    //  // const mentorData27: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData27);

//    //  // const mentorData28: MentorsInterface = {
//    //  //   intraId: '',
//     // //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//     // //   isActive: false,
//     // //   markdownContent: ``,
//    //  // };
//     // // mentorDataList.push(mentorData28);

//    //  // const mentorData29: MentorsInterface = {
//     // //   intraId: '',
//    //  //   name: '',
//     // //   profileImage: '',
//     // //   availableTime: null,
//    //  //   isActive: false,
//    //  //   markdownContent: ``,
//     // // };
//     // // mentorDataList.push(mentorData29);

//     // const mentorData30: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData30);

//     const mentorData52: MentorsInterface = {
//       intraId: 'm-engeng',
//       name: '정경호',
//       profileImage:
//         'https://ca.slack-edge.com/T039P7U66-U03DU1UN0P3-gc9a7b67d9c4-512',
//       availableTime: null,
//       isActive: false,
//       markdownContent: `
// ## 정경호

// Slack : engeng

// 자기소개

// - 대기업을 다니다 스타트업에 매료되어 10년 정도 스타트업 업계에 있습니다. 변화가 많고 빠른 업계라서 이벤트가 많아 아직도 재밌게 일을 하고 있습니다.
// - 창업 후 망해본 경험 다수 보유: 안전하게 시작하고, 안전하게? 망하는 방법 이야기 해줄 수 있습니다.
// - 문제를 찾고 IT 기술로 검증할 수 있도록 기술과 관련된 초기 단계부터 서비스 운영까지 가이드 가능합니다.

// 주요분야

// - Typescript, Javascript Backend 개발
// - Spring Boot, Kotlin
// - Android Native
// - AWS, GCP
// - 서비스 개발, 운영, 확장에 필요한 모든 Backend, Android, Frontend 에 대한 기술 일체

// 대외활동

// - 해커톤 커뮤니티 위드캠프(With Camp) 설립 및 운영 (2016~2020)
// - 드로이드 나이츠, Google Developer Group 발표 활동
// - 정주영창업대회 수상

// 주요경력

// - 2011~2012: 삼성전자 프린터 사업부 영상처리 랩
// - 2012~: 3번 창업 및 스타트업 근무
// - 2019~2021: 스타트업 남의집 프로젝트 외주 백엔드 개발
// 		- v0.1~v4.0 Spring Boot + Kotlin
// 		- Test Coverage 90%
// - 2020~2021: AI 스타트업 아틀라스랩스 백엔드 개발
// - 2021~2022: NFT 가치평가 스타트업 NFTBank 서비스팀 리더

// Cadet에게

// - 실패를 많이 해본 개발자, 창업자 입니다. 아직은 성공한 경험이 없지만, 제 주위엔 많아요. 하지만 그 성공한 사람들도 실패를 많이 해봤죠. 저의 성공은 “아직" 오지 않았다라고 생각합니다.
// - 개발자가 스타트업 업계에서 창업을 하고 망하고 개발자로서, 리더로서 일하며 어떻게 성장하는지 말씀드릴 수 있을것 같아요.`,
//     };
//     mentorDataList.push(mentorData52);

//     const mentorData01: MentorsInterface = {
//     //       intraId: 'm-nkang',
//     //       name: '강남석',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U03E55DSV3J-g5a8e515d22b-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // 자기소개

//     // - 42서울 1기 1차 최고령 Cadet
//     // - 공인회계사
//     // - 창업 실패 경험 有
//     // - 핀테크 스타트업 CFO, CLSA 파트너십 체결, 내부통제 및 업무 자동화, 229억원 규모 시리즈B 펀딩
//     // - 모바일 광고 스타트업 CFO, 코스닥 IPO 완료, 재무, 경영관리, IR, 법무, 인사 총괄
//     // - 삼일회계법인 IT 전문 회계사로서 M&A 및 DDR, IPO, valuation 자문, ERP업무 경험 다수
//     // - 상장사 M&A 자문 및 실사, 상장실질심사 지원, IPO 자문 등 상장 및 상장유지 관련 업무 경력 보유

//     // 주요분야

//     // - 창업, 투자유치
//     // - 사업모델
//     // - 원가분석

//     // 주요경력

//     // - ’21.03~현재	중고나라	CFO
//     // - ’17.02~’20.05	피플펀드컴퍼니 CFO
//     // - ’14.08~’17.01	퓨쳐스트림네트웍스 CFO, 코스닥 상장
//     // - ‘11.06~’14.08	삼일회계법인	M&A, 재무자문
//     // - ‘04.07~’11.05	삼일회계법인	회계감사, 실사`,
//     //     };
//     //     mentorDataList.push(mentorData01);

//     //     const mentorData02: MentorsInterface = {
//     //       intraId: 'm-jbkang',
//     //       name: '강진범',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U02B7V0GY5D-924081851fd2-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // ## **강진범**

//     // Slack : m-jbkang

//     // 자기소개

//     // - 개발적인 부분이든, 데이터 분석이든, 인공지능 전반적인 부분이든 어떤것이든 물어보세요.
//     // - 참여중인 github repo : 기업지원 때문에 다 private 이라... 딱 제 마음입니다.
//     // - 정기적으로 기술교류를 하는 private 모임을 진행하는데, 친목도모겸 기술 트렌드 공유정도 하고 있어요.
//     // - 페이스북 : [https://www.facebook.com/jinbeom.kang](https://www.facebook.com/jinbeom.kang)

//     // 주요분야

//     // - 데이터분석, 머신러닝, 딥러닝, 심볼릭 추론
//     // - SW아키텍처, SW테스트 등 SW품질

//     // 대외활동

//     // - SW마에스트로 멘토
//     // - 여러 해커톤 멘토 (서울시 서울이동통합서비스(Mass) 해커톤, 중앙대 다빈치 소프트웨어 해커톤 등)
//     // - 디자인패턴, SW공학, 인공지능, 데이터분석 강의 (LG전자, 메타넷 등)

//     // 주요경력 : 2004년 ~ (16년차)

//     // - 컴퓨터 공학박사 (세부전공: 인공지능, 인공지능 기술 논문 및 특허)
//     // - LG전자 (Android Framework, GPU/Graphics, AI Adaptation, Six Sigma MBB)
//     // - 신한은행 AI Lab (챗봇 기술 도입 및 전략 수립)
//     // - 자이냅스 CTO (심볼릭 대화추론 챗봇, TTS, 화자인식 기술 개발, 사용화)

//     // Cadet에게

//     // - 고민이 많은 분들에게 함께 고민을 해결할 수 있었으면 좋겠어요.
//     // - 개발자로서 갖춰야하는 역량을 넘어, 앞으로 이루어야 할 것에 대해 이야기 나누고 싶어요.
//     // - 저희 회사는 자기주도적인 인력을 원해요. 자기주도적이기 위해서 스스로 목표를 세우고, 그 목표를 달성하기 위한 플랜을 세우고, 플랜을 수행하며 스스로 리뷰할수 있는 역량이 필요해요. 자세한 이야기는 만나서..`,
//     //     };
//     //     mentorDataList.push(mentorData02);

//     //     const mentorData03: MentorsInterface = {
//     //       intraId: 'm-???',
//     //       name: '고지현',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U02B7V0GY5D-924081851fd2-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // # 고지현 멘토
//     //  1
//     // 상태: 멘토링 가능
//     // 생성일: 2022년 8월 4일 오후 2:05
//     // 전문분야: AI, IoT, 라즈베리파이, 소프트웨어 공학, 아두이노, 창업, 프로젝트 관리`,
//     //     };
//     //     mentorDataList.push(mentorData03);

//     //     const mentorData04: MentorsInterface = {
//     //       intraId: 'm-tedkim',
//     //       name: '김동수',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U022M7R95HQ-20ddc5cc4ac8-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // ## **김동수**

//     // Slack : m-tedkim

//     // 자기 소개

//     // - 무엇이 있는지 몰라 헤매이는 시작하는 개발자에게 도움이 되는 선배가 되어 드립니다.
//     // - 개발과 개발자로써의 고민상담도 할 수 있어요.
//     // - 페이스북 : [https://www.facebook.com/ds5apn](https://www.facebook.com/ds5apn)

//     // 주요분야

//     // - DevOps
//     // - 협업잘하는 방법
//     // - API 플랫폼
//     // - AWS
//     // - 시기에 맞는 적절한 기술 적용하기

//     // 대외활동

//     // - 서강대 캡스톤 멘토
//     // - 소프트웨어 중심대학 오픈핵 멘토
//     // - 소프트웨어에 물들다 강사
//     // - 목각코, 아재개발단

//     // 주요경력 : 2001년 ~ (20년차)

//     // - 현재 엘핀 CTO
//     // - 오아시스마켓 개발리드
//     // - 마켓컬리 CTO
//     // - 넥스트매치(아만다) CTO
//     // - 지니뮤직(kt뮤직) 개발팀장 (DevOps, 개발, 협업문화)
//     // - kth DevOps팀 팀장 (DevOps, DevOps 개발툴 개발, 개발인프라 개선)`,
//     //     };
//     //     mentorDataList.push(mentorData04);

//     //     const mentorData05: MentorsInterface = {
//     //       intraId: 'm-ruby',
//     //       name: '김루비',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U03DHNUQE6Q-9970446b6186-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // ### 👋 Hello, 42 Cadet!

//     // 안녕하세요~ 2기 1차에 cadet으로 활동하다 현재는 외국계 스타트업에서 근무 중인 m-ruby 입니다 :-)

//     // 혹시라도 덕몽어스(구스구스덕) 좋아하시는 분들 중 같이 하실 분 DM주세요! (두근두근)

//     // ### 👣 발자취

//     // [ruby-kim - Overview](https://github.com/ruby-kim)

//     // 2022.01 - 현재 Sibel International(Sibel Health 한국 지부) 클라우드 엔지니어

//     // 2020.10 - 2022.01 42SEOUL 2기 1차 Cadet

//     // ### 👓  멘토링 주요분야

//     // - 신입(주니어) 개발자 취준법
//     // 		- Github 관리하기
//     // 	- 인턴 및 정규직 지원할 때 Github 덕분에 면접까지 간 경우가 꽤 있습니다✨
//     // 	- Github를 내 마음대로 신명나게 꾸미는 법을 알려드립니다.
//     // 		- 포트폴리오 준비 / 인성 면접
//     // 	- 자신의 장점을 극대화할 수 있는 방안에 대해 상담 해드립니다.
//     // 	- 면접 팁은 특히 저같은 선천적 내성적인 분들께 많이 도움이 될 것이라 생각해요.
//     // 	(MBTI가 I로 시작합니다 😌)
//     // 	- [참고] 기술 면접은 시니어 멘토님들께 여쭤보시는 것을 추천드려요! 물론 경험담 공유를 원하시면 언제든지 가능합니다 😊
//     // 		- 외국계 기업 준비
//     // 	- 국내에서 영어 회화 공부하기
//     // 	- 외국계 기업 찾기 & 준비법
//     // 	- 참고로 토종 한국인입니다. ***아이 라잌 코리아***  🇰🇷 *(펄럭)*
//     // - 개발하면서 생기는 고민들
//     // 		- 42 프로젝트 말고 뭔가 더 해야할까요?
//     // 		- 어느 정도 언어 문법 알겠는데, 뭘 더 해야할까요?
//     // 		- 프로젝트 어떻게 시작하나요?
//     // 		- 어느 분야(프론트, 데이터사이언스, 인공지능 등)로 가야할지 잘 모르겠어요
//     // 		- 개발자를 준비하면서 한 번 쯤 해봤던 고민들 같이 얘기해봐요!
//     // - 따끈한 취준 & 입사 썰 듣고 싶으신 분들도 환영합니다!
//     // 		- ex) 면접 중 인공 암벽장 간 썰
//     // 		- ex) MAGA, 네카라쿠배 중 일부 기업 면접 썰
//     // 		- ex) 내가 알던 사람이 회사 선배님의 친구?! 썰
//     // 		- ex) 연봉 협상 썰
//     // 		- ex) 대기업을 포기하고 스타트업으로 취직한 썰 등
//     // 		- 이 외에 다양한 썰이 있습니다 📦
//     // - 가벼운 일상부터 고민 거리까지 상담 가능합니다.
//     // 		- 대인관계 등, 카뎃분들도 각자의 사정이 있으실거라 생각해요.
//     // 		- 또 가끔은 외롭다고 생각이 드실 때가 있지 않으신가요?
//     // 		- 사람 대 사람으로 같이 천천히 티타임 가지면서 힐링하는 시간을 가져봐요 😇

//     // ### ❌ 아래 분야에 대해서는 멘토링 불가능합니다. 다른 시니어 멘토님께 연락해보세요!

//     // - 42서울 과제: 그 유명한, ‘왼쪽 보고 오른쪽 보자'로 동료 카뎃분들께 질문해보세요.
//     // - 먼 미래 진로고민
//     // 		- 2022년 1월에 입사한 따끈따끈 신입입니다.
//     // 		- 개발 직군 관련해서 먼 미래까지는 아직 무리에요 🥲
//     // - 기술 분야 상담 & 코드 리뷰: 개발자 짬이 차면 해드릴 수 있겠지만, 위에 적었듯이 따끈한 신입입니다 🐣`,
//     //     };
//     //     mentorDataList.push(mentorData05);

//     //     const mentorData06: MentorsInterface = {
//     //       intraId: 'm-deal',
//     //       name: '김민창',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U03D8P6NG4W-34b6938dd398-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // # 다시 만나서 반가워요!

//     // 안녕하세요. 42서울에서 여러분과 함께 공부하던 minckim입니다.

//     // 새 이름 **m-deal**로 다시 뵙게 되었습니다.

//     // ~~42Seoul에는 탱과 딜이 있습니다. 힐 한 분 오시면 바로 레이드 출발!~~

//     // # 자기 소개

//     // ### **😵** 42서울을 시작하기 전까지의 이야기

//     // [https://youtu.be/hQFuUF2BXZg](https://youtu.be/hQFuUF2BXZg)

//     // Q: 서른 한 살 아죠씨, 개발자가 되기에 늦지 않았을까요?

//     // A: 늦지 않은 것 같습니다!

//     // ### **🤤** 34살이... 신입?!

//     // - 도대체 이 나이 먹도록 뭘 한 거죠?

//     // 		20살에 건축학과 진학, 군대 2년, 건축설계사무터 인턴, 26살에 느닷없이 휴학하고 기술고시(행정고시 이과ver) 수험생활 2년, 와우(월드오브워크래프트)를 반 년(...), 감사직 공무원 수험생활을 반 년, 다시 복학해서 학교를 마무리 하고 나니 30살이 되던 해에 대학교를 졸업했습니다.

//     // 		1년 동안 시제품 제작 지원센터에서 일하면서 작품활동을 했습니다. 사직하고 1년동안 대학원에 진학하여 로봇을 건축에 활용하는 방법을 연구했습니다.

//     // 		그러던 중에 42서울을 알게 되어 지원했습니다. 42에서 2년간 개발자가 될 준비를 했고, 지금은 그래픽스 엔지니어가 되었습니다.

//     // 		나이가 많고 비전공이라 걱정인 분들께 저의 경험이 좋은 사례가 되었으면 좋겠습니다.

//     // ### **👶** 주니어 그래픽스 엔지니어

//     // C++와 수학을 활용하는 직무 위주로 구직하다보니, 그래픽스 엔지니어가 되었습니다.

//     // # 경력 사항

//     // - 현) 쉐이커미디어 그래픽스 엔지니어 (2022.01 ~ 현재)
//     // 		- 클라이언트 요청을 토대로 서버에서 영상을 생성하는 렌더러를 개발하고 있습니다.
//     // 		- OpenGL과 C++를 주로 사용합니다.
//     // - 전) 42Seoul 카뎃/피시너 (2020.01 ~ 2022.03)

//     // # 멘토링 주제

//     // ### **😀** 멘토링 가능한 주제와 대상

//     // - 취직준비
//     // 		- 따끈따끈한 C++ 개발자 기술 면접 단골 질문이 궁금하신 분
//     // 		- 면접 경험, 포트폴리오 작성 경험, 연봉 협상 경험이 궁금하신 분
//     // 		- 42과제가 취직할 때 얼마나 도움 되었는지 궁금하신 분
//     // - 주니어 개발자의 회사 적응기
//     // 		- 두근두근 첫 출근 이야기가 궁금하신 분
//     // 		- 내가 잘 할 수 있을지 궁금하신 분
//     // 		- 내가 과연 방대한 코드를 이해하고 적응할 수 있을지 궁금하신 분
//     // - 그래픽스
//     // 		- 그래픽스 엔지니어가 되는 방법이 궁금하신 분
//     // 		- 게임 그래픽에 관심있는 분
//     // 		- 그래픽스를 독학하는 중인데 도저히 이해도 안 되고 자료도 못 찾겠다는 분
//     // - 수학 공부 하는 법
//     // 		- FDF, Cub3D, MiniRT하는데, 수학에 발목을 잡히신 분
//     // - ~~밥좀 사주세요~~
//     // 		- ~~강남 물가가 너무 비싸서 맨 날 한솥도시락만 드시는 분~~
//     // 		- ~~공식적인 자리에서는 들을 수 없는 썰들이 궁금하신 분~~
//     // 		- ~~42서울의 라떼는 썰이 궁금하신 분~~
//     // 		- 비전공자, 나이가 걱정이신 분

//     // ### **😩** 도움을 드릴 수 없는 주제

//     // - 개발자 로드맵
//     // 		- 저도 아직은 잘 모릅니다😅
//     // - 과제에 대한 구체적인 도움
//     // 		- 에이... 잘 아시죠?ㅋㅋ
//     // - 알고리즘 코딩테스트 준비
//     // 		- 라이브코딩테스트를 통해 입사 했지만, 일반적인 알고리즘 코딩 테스트와는 결이 다른 것 같아요. 저는 큰 도움이 안 될 것 같아요.
//     // - 포트폴리오 첨삭
//     // 		- 다른 시니어 개발자 분들이 더 잘 봐주실 것 같습니다.
//     // 		- 다만 저의 경험에 대한 공유는 환영합니다.`,
//     //     };
//     //     mentorDataList.push(mentorData06);

//     //     const mentorData07: MentorsInterface = {
//     //       intraId: 'm-kbs',
//     //       name: '김범수',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U03E55DJA48-21a3c143a2d6-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // Slack : m-kbs

//     // - 자기소개
//     // 		- 지금은 NAVER CLOVA에서 AI와 Android 관련 업무를 하고 있어요
//     // 		- 어느덧 9년째 Android Application 을 개발하고 있는 개발자 입니다
//     // 		- 취미로 야구랑 LCK를 즐겨보고 있어요

//     // - 주요경력 (2014 ~ )
//     // 		- NAVER CLOVA - Android, AI 경량화
//     // 		- NAVER LABS - Android
//     // 		- SK Planet - Android, iOS

//     // - 참여 프로젝트
//     // 		- FaceSign 얼굴인식 - NAVER 신사옥 프로젝트
//     // 		- LINE CarNavi  - 일본 출시
//     // 		- AKI - 아기용 스마트 워치(폰)
//     // 		- HOTZIL - 서비스 종료 ㅠ_ㅠ
//     // 		- 5DUCKS - 서비스 종료 ㅠ_ㅠ
//     // 		- T Store (현 원스토어), T store books (현 원스토리)

//     // - 대외활동
//     // 		- NAVER DEVIEW 2021

//     // ### Cadet 분들에게

//     // 모바일 개발의 매력을 아시나요??

//     // 기획, 디자인, server, ai, BSP, HW, QA, 마케팅, 광고 분들까지 정말 다양한 분들과 밀접하게 협업할 일이 많아서 서비스 이해도가 높아지고 그만큼 많은 사람들과 친해지고 이야기하게 돼요.

//     // 내가 만든 신규 앱이 지하철 옆자리에 앉으신 분이 사용하고 있을 때의 짜릿함까지!

//     // 함께 삽질을 해보거나 같이 성장해가고 싶거나 그냥 푸념을 늘어놓고 싶으신분들 아니면 그냥 커피 얻어먹고 싶으신 분들 까지 모두 다 좋아요!`,
//     //     };
//     //     mentorDataList.push(mentorData07);

//     //     const mentorData08: MentorsInterface = {
//     //       intraId: '42_paulsjkim_mentor',
//     //       name: '김성조',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U02FQLMV3R8-2b4e0299fb59-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // ## **김성조**

//     // Slack : 42_paulsjkim_mentor

//     // 자기소개

//     // - 페이스북 : [https://www.facebook.com/Paul.S.J.Kim](https://www.facebook.com/Paul.S.J.Kim)
//     // - 엉덩이로 코딩하는 개발자, 내게 쉬우면 남도 쉽다.
//     // - 하나의 주제로 설치형 패키지, 오픈소스, SaaS형 서비스를 개발하며 15년이상의 경험을 가지고 있습니다. 꼭 개발이 아니더라도 B2B 솔루션 분야에서는 마켓팅이나 사업을 시작하는 부분에서도 공유할 수있는 경험이 있을 듯 합니다.

//     // 직장경력 : 1998년 ~ (22년차)

//     // - 와탭랩스 CTO (와탭 APM/SaaS 개발)
//     // - 제니퍼소프트 CTO (제니퍼 APM개발)
//     // - LG CNS 최적화팀(성능 튜닝, 프레임웍 개발)

//     // 주요분야

//     // - 성능 튜닝, 솔루션 개발
//     // - Java BCI, File DB
//     // - 모니터링 서비스(SaaS)개발

//     // 대외활동

//     // - Scouter`,
//     //     };
//     //     mentorDataList.push(mentorData08);

//     //     const mentorData09: MentorsInterface = {
//     //       intraId: 'm-sulac',
//     //       name: '김윤래',
//     //       profileImage: null,
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // 자기 소개 : [https://github.com/younlea/WHOAMI-HANGUL-](https://github.com/younlea/WHOAMI-HANGUL-)

//     // slack ID : m-sulac

//     // 개인 블로그 : [http://sulac.egloos.com/](http://sulac.egloos.com/)`,
//     //     };
//     //     mentorDataList.push(mentorData09);

//     //     const mentorData10: MentorsInterface = {
//     //       intraId: 'm-jfeel',
//     //       name: '김종필',
//     //       profileImage:
//     //         'https://ca.slack-edge.com/T039P7U66-U02BNM41F7U-e5dc25ce105c-512',
//     //       availableTime: null,
//     //       isActive: false,
//     //       markdownContent: `
//     // ## **김종필**

//     // Slack : m-jongfeel-kim

//     // 자기소개

//     // - AR(Augmented Reality), DT(Digital Twin) 전문 기업 버넥트에서 Make/View 및 Remote hololens 등의 유니티 기반 **제품 개발 팀장** 및 **테크니컬 리드**를 맡고 있습니다.
//     // - 하는 일과 달리 주요 관심 분야는 소프트웨어 장인정신, 객체지향 분석/설계, 테스트 자동화와 CI/CD, 양자컴퓨팅(?) 등입니다.
//     // - 개인 멘토링 활동도 진행하고 있으며, 개인 소프트웨어 커뮤니티도 있어서 여러 멘티 분들과 소프트웨어의 가치에 대해 공부하고 토론합니다.
//     // - 개인 github

//     // 		[jongfeel - Overview](https://github.com/jongfeel)

//     // - 개인 멘토링 github organization

//     // 		[Feel's software development mentoring](https://github.com/ThinkAboutSoftware)

//     // 주요분야

//     // - Unity를 기반으로 한 AR/VR/XR/MR 기술을 토대로 한 Multiplatform(UWP, Android, iOS) 제품 개발
//     // - .NET 위에서 C#으로 개발 가능한 모든 종류의 소프트웨어
//     // - 소프트웨어 고전 책에 대한 열띤 토론(고전 독서토론회, 학술회의 등 진행)
//     // - 가끔 Javascript frontend, backend 기술 리뷰

//     // 대외활동

//     // - Feel's software development mentoring ([github.com](https://github.com/ThinkAboutSoftware))
//     // 		1. 온라인 모각코: 매주 토요일 오전 10:30 ~ 12:30, 2021년 9월 기준 40회 이상 연속 진행
//     // 		2. 1:1 혹은 팀 멘토링: 2주 간격으로 지속적인 대화를 통한 방향성 잡기와 코드 리뷰
//     // 		3. 행사
//     // 	1. 학술 회의, 매년 2월 ~ 6월 진행, 소프트웨어 관련된 책 읽고 리뷰 및 토론
//     // 	2. 홈 커밍 데이, 매년 12월 셋째주 주말, 2021년 12월 18일 토요일 세번째 개최 예정
//     // - 한이음 ICT 멘토 (2018 ~ 현재)
//     // - 고등학생 대상 프로그래머 직업인 소개 강사 (2019 ~ 현재): 연 2~5회
//     // - GDG 인천, 송도 등에서 개발자 커뮤니티 활동
//     // - 교육하는 사람들 커뮤니티 활동
//     // - 하드코딩하는 사람들 커뮤니티 활동 (2018, 2019 연말 세미나 발표)
//     // - Mixed Reality 관련 open source 활동
//     // - KAIST 대학원생 대상 MixedReality와 WebRTC 기술에 대한 특강 진행 (2021)

//     // 주요경력 2004년 ~ (17년차), 버넥트에서 최근 5개까지 한 프로젝트

//     // - 팀내 Unity 공통 모듈 개발 및 모듈 패키지 배포를 위한 CI/CD 구축 (with github action), 2021
//     // - KT wearable 프로젝트, 2021
//     // - Remote Hololens 1.0, 2.0 제품 개발, 2020 ~ 2021
//     // - 황룡사 복원 사업 개발, 2019
//     // - 한전 연구과제, AR 앱 개발, 2018 ~ 2019
//     // - 그외 5개 회사에서 약 40개 이상의 SI 프로젝트 및 제품 개발 프로젝트 진행
//     // - 이력서 링크 (영문)

//     // 		[Indeed Resume](https://my.indeed.com/p/KimJ-ongFeel)

//     // Cadet에게

//     // - 주로 제가 찾아가서 대화 하고 교육생 분들이 관심 있는 것 하고 싶은 것 위주로 조언해주고 할 예정입니다.
//     // - AR, MR 같은 기술이나 Hololens2, Oculus quest2 등의 디바이스로 뭔가 만들고 싶은 것에 관심이 있으시면 얘기해 주세요
//     // - 소프트웨어를 만든다는 것의 의미와 가치를 배우고 싶으시다면 저와 열띤 토론을 해주시면 좋습니다.
//     // - 가장 완성도 있고 좋은 프로그래밍 언어라고 생각하지만 우리나라에서는 유독 외면 받는 C#에 대해 알고 싶으시면 저와 함께하시면 좋습니다.`,
//     //     };
//     //     mentorDataList.push(mentorData10);

//     // const mentorData11: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData11);

//     // const mentorData12: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData12);

//     // const mentorData13: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData13);

//     // const mentorData14: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData14);

//     // const mentorData15: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData15);

//     // const mentorData16: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData16);

//     // const mentorData17: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData17);

//     // const mentorData18: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData18);

//     // const mentorData19: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData19);

//     // const mentorData20: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData20);

//     // const mentorData21: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData21);

//     // const mentorData22: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData22);

//     // const mentorData23: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData23);

//     // const mentorData24: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData24);

//     // const mentorData25: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData25);

//     // const mentorData26: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData26);

//     // const mentorData27: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData27);

//     // const mentorData28: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData28);

//     // const mentorData29: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData29);

//     // const mentorData30: MentorsInterface = {
//     //   intraId: '',
//     //   name: '',
//     //   profileImage: '',
//     //   availableTime: null,
//     //   isActive: false,
//     //   markdownContent: ``,
//     // };
//     // mentorDataList.push(mentorData30);

//     const mentorData52: MentorsInterface = {
//       intraId: 'm-engeng',
//       name: '정경호',
//       profileImage:
//         'https://ca.slack-edge.com/T039P7U66-U03DU1UN0P3-gc9a7b67d9c4-512',
//       availableTime: null,
//       isActive: false,
//       markdownContent: `
// ## 정경호

// Slack : engeng

// 자기소개

// - 대기업을 다니다 스타트업에 매료되어 10년 정도 스타트업 업계에 있습니다. 변화가 많고 빠른 업계라서 이벤트가 많아 아직도 재밌게 일을 하고 있습니다.
// - 창업 후 망해본 경험 다수 보유: 안전하게 시작하고, 안전하게? 망하는 방법 이야기 해줄 수 있습니다.
// - 문제를 찾고 IT 기술로 검증할 수 있도록 기술과 관련된 초기 단계부터 서비스 운영까지 가이드 가능합니다.

// 주요분야

// - Typescript, Javascript Backend 개발
// - Spring Boot, Kotlin
// - Android Native
// - AWS, GCP
// - 서비스 개발, 운영, 확장에 필요한 모든 Backend, Android, Frontend 에 대한 기술 일체

// 대외활동

// - 해커톤 커뮤니티 위드캠프(With Camp) 설립 및 운영 (2016~2020)
// - 드로이드 나이츠, Google Developer Group 발표 활동
// - 정주영창업대회 수상

// 주요경력

// - 2011~2012: 삼성전자 프린터 사업부 영상처리 랩
// - 2012~: 3번 창업 및 스타트업 근무
// - 2019~2021: 스타트업 남의집 프로젝트 외주 백엔드 개발
// 		- v0.1~v4.0 Spring Boot + Kotlin
// 		- Test Coverage 90%
// - 2020~2021: AI 스타트업 아틀라스랩스 백엔드 개발
// - 2021~2022: NFT 가치평가 스타트업 NFTBank 서비스팀 리더

// Cadet에게

// - 실패를 많이 해본 개발자, 창업자 입니다. 아직은 성공한 경험이 없지만, 제 주위엔 많아요. 하지만 그 성공한 사람들도 실패를 많이 해봤죠. 저의 성공은 “아직" 오지 않았다라고 생각합니다.
// - 개발자가 스타트업 업계에서 창업을 하고 망하고 개발자로서, 리더로서 일하며 어떻게 성장하는지 말씀드릴 수 있을것 같아요.`,
//     };
//     mentorDataList.push(mentorData52);
