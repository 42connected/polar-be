import { CadetsInterface } from 'src/v1/interface/cadets/cadets.interface';
import { MentoringLogsInterface } from 'src/v1/interface/mentoring-log/mentoring-log.interface';
import { MentorsInterface } from 'src/v1/interface/mentors/mentors.interface';
import { setSeederFactory } from 'typeorm-extension';
import { Reports } from '../../entities/reports.entity';

interface ReportsInterface {
    cadetsMeta: CadetsInterface;
    mentorsMeta: MentorsInterface;
    mentorsLogsMeta: MentoringLogsInterface;
}


export default setSeederFactory(
  Reports,
  (faker, meta: ReportsInterface) => {
    const reports = new Reports();

    return reports;
  },
);
