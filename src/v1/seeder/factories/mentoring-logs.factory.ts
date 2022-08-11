import { MentoringLogs } from "../../entities/mentoring-logs.entity"
import { setSeederFactory } from "typeorm-extension"
import { Cadets } from "../../entities/cadets.entity";
import { Mentors } from "../../entities/mentors.entity";

interface mentoringLogsFactoryMeta {
    cadetsMeta: Cadets[];
    mentorsMeta: Mentors[];
}

export default setSeederFactory(
    MentoringLogs,
    (faker, meta: mentoringLogsFactoryMeta) => {
        const mentoringLogs = new MentoringLogs();
        
        
        mentoringLogs.cadets = meta.cadetsMeta[faker.datatype.number(meta.cadetsMeta.length - 1)];
        mentoringLogs.mentors = meta.mentorsMeta[faker.datatype.number(meta.mentorsMeta.length - 1)];
        mentoringLogs.meetingAt = [faker.date.soon(), faker.date.soon(3)];
        mentoringLogs.topic = faker.word.conjunction(50);
        mentoringLogs.content = faker.word.noun(1000);
        mentoringLogs.money = faker.datatype.number({min:0, max:10}) * 50000;
        mentoringLogs.status = faker.helpers.arrayElement(['pending', 'rejected', 'accepted', 'completed']);
        mentoringLogs.rejectMessage = faker.lorem.paragraph(2);
        mentoringLogs.reportStatus = faker.helpers.arrayElement(['pending', 'rejected', 'available', 'no']);
        mentoringLogs.requestTime1 = [faker.date.soon(), faker.date.soon(3)];
        mentoringLogs.requestTime2 = faker.datatype.boolean() ?  [faker.date.soon(), faker.date.soon(3)] : null;
        mentoringLogs.requestTime3 = (mentoringLogs.requestTime2 && faker.datatype.boolean()) ? [faker.date.soon(), faker.date.soon(3)] : null;
        return mentoringLogs;
    },
    );