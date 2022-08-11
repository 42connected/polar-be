import { stringify } from "querystring";
import { Mentors } from "src/v1/entities/mentors.entity";
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Mentors, faker => {
  const mentors = new Mentors();
    const timeRoom = [];
    const startHour = faker.datatype.number({ min: 0, max: 21 });
    const startMinute = faker.datatype.boolean() ? 0 : 30;
    const endHour = faker.datatype.number({ min: startHour, max: 23 });
    const endMinute = faker.datatype.boolean() ? 0 : 30;
    const timeSet = [{
        startHour,
        startMinute,
        endHour,
        endMinute,
    }];
    for (let i = 0; i < 7; i++) {
        faker.datatype.boolean() ? timeRoom.push(timeSet) : timeRoom.push([]);
    }
  mentors.intraId = faker.name.lastName('male');
  mentors.name = faker.name.firstName('male');
    mentors.company = faker.company.companyName();
    mentors.duty = faker.company.bs();
    mentors.profileImage = faker.image.avatar();
    mentors.availableTime = timeRoom.toString();

  return mentors;
});
