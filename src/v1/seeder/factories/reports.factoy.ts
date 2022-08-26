import { Cadets } from '../../entities/cadets.entity';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { Mentors } from '../../entities/mentors.entity';
import { setSeederFactory } from 'typeorm-extension';
import { Reports } from '../../entities/reports.entity';

interface ReportsMetaInterface {
  mentoringLogsMeta: MentoringLogs[];
}

export default setSeederFactory(
  Reports,
  (faker, meta: ReportsMetaInterface) => {
    const reports = new Reports();
    const imageUrlRoom = [];
    for (let i = 0; i < faker.datatype.number(4); i++) {
      imageUrlRoom.push(faker.image.imageUrl());
    }
    const mentoringLogsRandom =
      meta.mentoringLogsMeta[
        faker.datatype.number(meta.mentoringLogsMeta.length - 1)
      ];
    reports.mentoringLogs = mentoringLogsRandom;
    reports.cadets = mentoringLogsRandom.cadets;
    reports.mentors = mentoringLogsRandom.mentors;
    reports.place = faker.helpers.arrayElement(['on-line', 'off-line']);
    reports.topic = faker.word.noun(50);
    reports.content = faker.word.noun(1000);
    reports.money = faker.datatype.number({ min: 0, max: 10 }) * 50000;
    reports.status = faker.helpers.arrayElement(['대기중', '완료']);
    reports.imageUrl = [faker.image.imageUrl(), faker.image.imageUrl()];
    reports.signatureUrl = faker.internet.url();
    reports.feedbackMessage = faker.lorem.paragraph(3);
    reports.feedback1 = faker.datatype.number({ min: 1, max: 5 });
    reports.feedback2 = faker.datatype.number({ min: 1, max: 5 });
    reports.feedback3 = faker.datatype.number({ min: 1, max: 5 });

    return reports;
  },
);
