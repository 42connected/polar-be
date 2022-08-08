// import { DataSource } from "typeorm"
// import { Seeder, SeederFactoryManager } from "typeorm-extension"
// import { MentorKeywords } from "../entities/mentor-keywords.entity";
// import { Mentors } from "../entities/mentors.entity";

// export class MentorKeywordsSeeder implements Seeder {
//   async run(
//     dataSource: DataSource,
//     factoryManager: SeederFactoryManager
//   ): Promise<void> {
//       const keywordRepository = dataSource.getRepository(MentorKeywords);
//       const menterRepositoty = dataSource.getRepository(Mentors);
//       const mentor
//       console.log('Seeding mentor-keywords...');
//       const mentorId = await (await menterRepositoty.findOneBy({ intraId: 'm-engeng' })).id;
//     const keywordData = {
//         // mentorId ,
//         // keywordId: 'keyword_id',
//         // keywords: '좋은아침말'
//         // mentors : 'mentor_id',
//     }

//     const newKeyword = keywordRepository.create(keywordData);
//     await keywordRepository.save(newKeyword);
//   }
// }
