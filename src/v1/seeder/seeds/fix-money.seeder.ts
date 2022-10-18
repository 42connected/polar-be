import { Reports } from '../../entities/reports.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Mentors } from '../../entities/mentors.entity';
import { getTotalHour } from '../../../util/utils';

export class FixMoneySeeder implements Seeder {
  calculateMoney(
    monthlyTotal: number,
    dailyTotal: number,
    meetingAt: Date[],
  ): number {
    const MONTH_LIMIT = 1000000;
    const DAY_LIMIT = 400000;
    const pay = 100000;
    let money = Math.floor(getTotalHour(meetingAt)) * pay;
    if (dailyTotal >= DAY_LIMIT || monthlyTotal >= MONTH_LIMIT) return 0;
    if (monthlyTotal + money >= MONTH_LIMIT) money = MONTH_LIMIT - monthlyTotal;
    if (dailyTotal + money >= DAY_LIMIT) money = DAY_LIMIT - dailyTotal;
    return money;
  }

  async run(dataSource: DataSource): Promise<void> {
    const mentorsRepository = dataSource.getRepository<Mentors>(Mentors);
    const reportsRepository = dataSource.getRepository<Reports>(Reports);
    console.log("Fixing mentors' money...");

    const mentors: Mentors[] = await mentorsRepository.find();
    const now: Date = new Date();

    for (const mentor of mentors) {
      console.log('===========', mentor.intraId, '===========');
      const reports: Reports[] = await reportsRepository.find({
        where: { mentors: { id: mentor.id }, status: '작성완료' },
        relations: { mentoringLogs: true },
      });
      for (let year = 2022; year <= now.getFullYear(); year++) {
        for (let month = 0; month < 12; month++) {
          let monthlyTotal = 0;
          for (let date = 1; date < 32; date++) {
            let dailyTotal = 0;
            for (const report of reports) {
              const money = this.calculateMoney(
                monthlyTotal,
                dailyTotal,
                report.mentoringLogs.meetingAt,
              );
              if (
                report.mentoringLogs.meetingAt[0].getFullYear() === year &&
                report.mentoringLogs.meetingAt[0].getMonth() === month &&
                report.mentoringLogs.meetingAt[0].getDate() == date
              ) {
                console.log(
                  `${year}.${month + 1}.${date} - ${getTotalHour(
                    report.mentoringLogs.meetingAt,
                  )}시간 진행`,
                );
                console.log('월', monthlyTotal, '일', dailyTotal, '->', money);
                console.log();
                monthlyTotal += money;
                dailyTotal += money;
                report.money = money;
                await reportsRepository.save(report);
              }
            }
          }
        }
      }
    }
  }
}
