import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { ReportsInterface } from 'src/v1/interface/reports/reports.interface';
import { DataSource, In, Not } from 'typeorm';
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
    // --- 테스트용 ---
    const mentors = await mentorRepository.findOneBy({ intraId: 'm-engeng' });
    const cadets = await cadetRepository.findOneBy({ intraId: 'nakkim' });
    const mentoringLogs: MentoringLogs[] = await mentoringLogsRepository.find({
      relations: {
        mentors: true,
        cadets: true,
      },
      where: { topic: '테스트용멘토링로그' },
    });
    if (mentoringLogs.length === 0) {
      console.log('No mentoring logs found');
      return;
    }
    // ------------
    const reportData: ReportsInterface = {
      mentors,
      cadets,
      status: '작성중',
      content: '테스트',
      place: 'on-line',
      imageUrl: [
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      ],
      mentoringLogs: mentoringLogs[0],
    };

    const newUser = reportRepository.create(reportData);
    await reportRepository.save(newUser);

    const reportsFactory = await factoryManager.get(Reports);
    const reportsMentoingLogs = await reportRepository.find({
      relations: {
        mentoringLogs: true,
      },
      select: {
        mentoringLogs: {
          id: true,
        },
      },
    });

    const reportsMentoingLogsRoom = reportsMentoingLogs.map(report => {
      if (report.mentoringLogs?.id) {
        return report.mentoringLogs.id;
      }
    });
    const mentoringLogsMeta = await mentoringLogsRepository.find({
      relations: {
        cadets: true,
        mentors: true,
      },
      where: {
        id: Not(In(reportsMentoingLogsRoom)),
      },
    });
    if (mentoringLogsMeta.length === 0) {
      console.log('No mentoring logs found');
      return;
    }
    // await reportsFactory.setMeta({ mentoringLogsMeta });
    // await reportsFactory.saveMany(4);
  }
