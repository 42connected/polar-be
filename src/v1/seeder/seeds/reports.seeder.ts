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
    const cadetId = await cadetRepository.findOne({
      select: { id: true },
      where: { intraId: 'jeounpar' },
    });
    const mentorId = await mentorRepository.findOne({
      select: { id: true },
      where: { intraId: 'm-kbs' },
    });
    const mentoringLogs = await mentoringLogsRepository.find({
      where: { mentors: true, cadets: true },
    });
    const index = 12;
    const newData = reportRepository.create({
      mentoringLogs: mentoringLogs[index],
      mentors: mentorId,
      cadets: cadetId,
      status: '완료',
      topic: mentoringLogs[index].topic,
      content: mentoringLogs[index].content,
      feedback1: 5,
      feedback2: 5,
      feedback3: 5,
      feedbackMessage: '좋았습니다',
      money: 100000,
      place: 'on-line',
      imageUrl: [
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
      ],
      signatureUrl:
        'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
    });
    try {
      await reportRepository.save(newData);
    } catch (err) {
      console.log(err);
    }
  }
}
