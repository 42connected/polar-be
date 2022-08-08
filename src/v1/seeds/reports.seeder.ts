import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { Cadets } from "../entities/cadets.entity";
import { Mentors } from "../entities/mentors.entity";
import { Reports } from "../entities/reports.entity";

export class ReportsSeeder implements Seeder{
  async run(
    dataSource: DataSource,
        factoryManager: SeederFactoryManager
  ): Promise<void> {
    const reportRepository = dataSource.getRepository(Reports);
    const mentorRepository = dataSource.getRepository(Mentors);
    const cadetRepository = dataSource.getRepository(Cadets);

    const mentors = await mentorRepository.findOneBy({ intraId: 'm-engeng' });
    const cadets = await cadetRepository.findOneBy({ intraId: 'jojoo' });
    console.log('Seeding reports...');
    const reportData = {
      mentors,
      cadets,
      content: '안녕하세요',
            place: "on-line",
            imageUrl: ["https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"],
        }

    const newUser = reportRepository.create(reportData);
    await reportRepository.save(newUser);
  }
}