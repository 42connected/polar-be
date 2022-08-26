import { Mentors } from '../../entities/mentors.entity';
import { setSeederFactory } from 'typeorm-extension';

export default setSeederFactory(Mentors, faker => {
  const mentors = new Mentors();
  const timeRoom = [];
  const startHour = faker.datatype.number({ min: 0, max: 21 });
  const startMinute = faker.datatype.boolean() ? 0 : 30;
  const endHour = faker.datatype.number({ min: startHour, max: 23 });
  const endMinute = faker.datatype.boolean() ? 0 : 30;
  const timeSet = [
    {
      startHour,
      startMinute,
      endHour,
      endMinute,
    },
  ];
  for (let i = 0; i < 7; i++) {
    faker.datatype.boolean() ? timeRoom.push(timeSet) : timeRoom.push([]);
  }
  const tagRoom = [];
  for (let i = 0; i < 4; i++) {
    tagRoom.push(faker.lorem.word());
  }

  mentors.intraId = faker.name.lastName('male');
  mentors.name = faker.name.firstName('male');
  mentors.email = faker.internet.email();
  mentors.company = faker.company.companyName();
  mentors.duty = faker.company.bsNoun();
  mentors.profileImage = faker.image.avatar();
  mentors.availableTime = JSON.stringify(timeRoom);
  mentors.introduction = faker.lorem.sentence();
  mentors.tags = tagRoom;
  mentors.isActive = faker.datatype.boolean();
  mentors.updatedAt = faker.date.soon();
  return mentors;
});
