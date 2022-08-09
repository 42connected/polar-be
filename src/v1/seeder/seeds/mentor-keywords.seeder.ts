import { Keywords } from "src/v1/entities/keywords.entity";
import { MentorKeywords } from "src/v1/entities/mentor-keywords.entity";
import { Mentors } from "src/v1/entities/mentors.entity";
import { KeywordsInterface } from "src/v1/interface/keywords/keywords.interface";
import { MentorKeywordsInterface } from "src/v1/interface/mentor-keywords/mentor-keywords.interface";
import { MentorsInterface } from "src/v1/interface/mentors/mentors.interface";
import { DataSource } from "typeorm"
import { Seeder, SeederFactoryManager } from "typeorm-extension"

export class MentorKeywordsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
      console.log("Seeding mentor-keywords...");
      try {
          const keywordRepository = dataSource.getRepository(Keywords);
          const mentorRepository = dataSource.getRepository(Mentors);
          const mentorKeywordRepository = dataSource.getRepository(MentorKeywords);
          console.log('Seeding mentor-keywords...');
          const keywords: KeywordsInterface = await keywordRepository.findOneBy({ name: 'web' });
          //   const mentors: MentorsInterface = await mentorRepository.findOneBy({ intraId: 'm-engeng' });
          console.log(keywords);
          //   const keywordData: MentorKeywordsInterface = {
          //     mentors,
          //     keywords,
          // }

          // const newKeyword = mentorKeywordRepository.create(keywordData);
          // await mentorKeywordRepository.save(newKeyword);
      } catch (error) {
            console.log(error);
        }
  }
}
