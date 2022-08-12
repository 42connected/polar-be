import { Cadets } from '../../entities/cadets.entity';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { Mentors } from '../../entities/mentors.entity';
import { Reports } from '../../entities/reports.entity';
import { CadetsInterface } from 'src/v1/interface/cadets/cadets.interface';
import { MentoringLogsInterface } from 'src/v1/interface/mentoring-log/mentoring-log.interface';
import { MentorsInterface } from 'src/v1/interface/mentors/mentors.interface';
import { ReportsInterface } from 'src/v1/interface/reports/reports.interface';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class MentoringLogsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Seeding mentoring-logs...');
    const mentoringLogsRepository = dataSource.getRepository(MentoringLogs);
    const mentorRepository = dataSource.getRepository(Mentors);
    const cadetRepository = dataSource.getRepository(Cadets);
    const reportsRepository = dataSource.getRepository(Reports);

    // const mentors = await mentorRepository.findOneBy({
    //   intraId: 'm-engeng',
    // });
    // const cadets = await cadetRepository.findOneBy({ intraId: 'jojoo' });

    // const mentoringLogsData: MentoringLogsInterface = {
    //   mentors,
    //   cadets,
    //   topic: 'What is making you feel good?',
    //   content: 'Very good morning',
    //   status: 'sleeping',
    //   reportStatus: 'go hard',
    //   requestTime1: [],
    // };
    // mentoringLogsData.requestTime1.push(new Date());

    // const newUser = mentoringLogsRepository.create(mentoringLogsData);
    // await mentoringLogsRepository.save(newUser);

    const mentoringLogsFactory = await factoryManager.get(MentoringLogs);
    const cadetsMeta = await cadetRepository.find();
    const mentorsMeta = await mentorRepository.find();
    await mentoringLogsFactory.setMeta({ cadetsMeta, mentorsMeta });
    await mentoringLogsFactory.saveMany(4);
  }
}
