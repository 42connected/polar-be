import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { ReportsInterface } from 'src/v1/interface/reports/reports.interface';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Cadets } from '../../entities/cadets.entity';
import { Mentors } from '../../entities/mentors.entity';
import { Reports } from '../../entities/reports.entity';

export class ReportsSeeder implements Seeder {
  async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const reportRepository = dataSource.getRepository(Reports);
    const mentorRepository = dataSource.getRepository(Mentors);
    const cadetRepository = dataSource.getRepository(Cadets);
    const mentoringLogsRepository = dataSource.getRepository(MentoringLogs);

    console.log('Seeding reports...');
    // const mentors = await mentorRepository.findOneBy({ intraId: 'm-engeng' });
    // const cadets = await cadetRepository.findOneBy({ intraId: 'jojoo' });
    // const mentoringLogs = await mentoringLogsRepository.find({
    //   relations: {
    //     mentors: true,
    //     cadets: true,
    //   },
    //   where: {
    //     // topic: 'What is making you feel good?',
    //     mentors: {
    //       id: mentors.id,
    //     },
    //     cadets: {
    //       id: cadets.id,
    //     },
    //   },
    // });
    // if (mentoringLogs.length === 0) {
    //   console.log('No mentoring logs found');
    //   return;
    // }
    // const reportData: ReportsInterface = {
    //   mentors,
    //   cadets,
    //   content: '안녕하세요',
    //   place: 'on-line',
    //   imageUrl: [
    //     'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    //   ],
    //   mentoringLogs: mentoringLogs[0],
    // };

    // const newUser = reportRepository.create(reportData);
    // await reportRepository.save(newUser);

    const reportsFactory = await factoryManager.get(Reports);
    const mentoringLogsMeta = await mentoringLogsRepository.find({
      relations: {
        cadets: true,
        mentors: true,
      },
      select: {
        id: true,
      },
    });
    const reportsMeta = await reportRepository.find({
      relations: {
        mentoringLogs: true,
      },
      select: {
        mentoringLogs: {
          id: true,
        },
      },
    });

    // reportsMeta.forEach((reports) => {
    mentoringLogsMeta.filter(
      mentoringLogs =>
        mentoringLogs.id !== '937800a0-78e5-42db-9089-337f33a55806',
    );

    console.log(mentoringLogsMeta[0].id);

    // console.log(reportsMeta);
    // console.log(mentoringLogsMeta);
    // await reportsFactory.setMeta({ mentoringLogsMeta });
    // await reportsFactory.saveMany(4);
  }
}
