import { Cadets } from '../../entities/cadets.entity';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { Mentors } from '../../entities/mentors.entity';
import { MentoringLogsInterface } from 'src/v1/interface/mentoring-log/mentoring-log.interface';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class MentoringLogsSeeder implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    console.log('Seeding mentoring-logs...');
    const mentoringLogsRepository = dataSource.getRepository(MentoringLogs);
    const mentorRepository = dataSource.getRepository(Mentors);
    const cadetRepository = dataSource.getRepository(Cadets);

    const cadetId = await cadetRepository.findOne({
      select: { id: true },
      where: { intraId: 'jeounpar' },
    });
    const mentorId = await mentorRepository.findOne({
      select: { id: true },
      where: { intraId: 'm-engeng' },
    });

    const mentoringLogsData: Partial<MentoringLogs> = {
      mentors: mentorId,
      cadets: cadetId,
      topic: '42서울 프론트엔드 사이드프로젝트',
      content: '42서울 프론트엔드 사이드프로젝트',
      status: '완료',
      requestTime1: [
        new Date('2022-08-18T10:00:00Z'),
        new Date('2022-08-18T11:30:00Z'),
      ],
      meetingAt: [
        new Date('2022-08-18T10:00:00Z'),
        new Date('2022-08-18T11:30:00Z'),
      ],
    };

    const newUser = mentoringLogsRepository.create(mentoringLogsData);
    await mentoringLogsRepository.save(newUser);
  }
}
