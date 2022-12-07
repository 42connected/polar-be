import * as dayjs from 'dayjs';
import { getTotalHour } from 'src/util/utils';

/**
 * 의심되는 시나리오를 검증해보기 위한 테스트 코드입니다.
 */
describe('calculateTotalHour spec', () => {
  const NOW = dayjs()
    .set('year', 2022)
    .set('month', 11)
    .set('date', 1)
    .set('hour', 9)
    .minute(0)
    .second(0);

  describe('daily', () => {
    it('멘토링이 59분만에 끝나면 0원이 반환된다', async () => {
      // given
      const DUMMY_START = NOW.toDate();
      const DUMMY_END = NOW.add(59, 'minute').toDate();
      const DUMMY_FIRST_MEETINGS = [
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
      ];
      // when
      const res = calculateTotalHour(
        DUMMY_START,
        DUMMY_END,
        DUMMY_FIRST_MEETINGS,
      );
      // then
      expect(res).toEqual(0);
    });

    it('dailyTotal이 30만원 일때, 100_000원이 반환된다', async () => {
      // given
      const DUMMY_START = NOW.toDate();
      const DUMMY_END = NOW.add(1, 'hour').toDate();
      const DUMMY_FIRST_MEETINGS = [
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
      ];
      // when
      const res = calculateTotalHour(
        DUMMY_START,
        DUMMY_END,
        DUMMY_FIRST_MEETINGS,
      );
      // then
      expect(res).toEqual(100_000);
    });

    it('dailyTotal이 40만원 일때, 0원이 반환된다', async () => {
      // given
      const DUMMY_START = NOW.toDate();
      const DUMMY_END = NOW.add(1, 'hour').toDate();
      const DUMMY_FIRST_MEETINGS = [
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
      ];
      // when
      const res = calculateTotalHour(
        DUMMY_START,
        DUMMY_END,
        DUMMY_FIRST_MEETINGS,
      );
      // then
      expect(res).toEqual(0);
    });

    it('dailyTotal이 50만원 일때, 0원이 반환된다', async () => {
      // given
      const DUMMY_START = NOW.toDate();
      const DUMMY_END = NOW.add(1, 'hour').toDate();
      const DUMMY_FIRST_MEETINGS = [
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
        { at: NOW.toDate(), money: 100_000 },
      ];
      // when
      const res = calculateTotalHour(
        DUMMY_START,
        DUMMY_END,
        DUMMY_FIRST_MEETINGS,
      );
      // then
      expect(res).toEqual(0);
    });
  });

  describe('monthly', () => {
    it('이번달에 9시간했다면, 10만원이 반환된다', async () => {
      // given
      const DUMMY_START = NOW.set('date', 31).toDate();
      const DUMMY_END = NOW.date(31).add(1, 'hour').toDate();
      const DUMMY_FIRST_MEETINGS = [
        { at: NOW.add(1, 'day').toDate(), money: 100_000 },
        { at: NOW.add(2, 'day').toDate(), money: 100_000 },
        { at: NOW.add(3, 'day').toDate(), money: 100_000 },
        { at: NOW.add(4, 'day').toDate(), money: 100_000 },
        { at: NOW.add(5, 'day').toDate(), money: 100_000 },
        { at: NOW.add(6, 'day').toDate(), money: 100_000 },
        { at: NOW.add(7, 'day').toDate(), money: 100_000 },
        { at: NOW.add(8, 'day').toDate(), money: 100_000 },
        { at: NOW.add(9, 'day').toDate(), money: 100_000 },
      ];
      // when
      const res = calculateTotalHour(
        DUMMY_START,
        DUMMY_END,
        DUMMY_FIRST_MEETINGS,
      );
      // then
      expect(res).toEqual(100_000);
    });

    it('이번달에 10시간했다면, 0만원이 반환된다', async () => {
      // given
      const DUMMY_START = NOW.set('date', 31).toDate();
      const DUMMY_END = NOW.date(31).add(1, 'hour').toDate();
      const DUMMY_FIRST_MEETINGS = [
        { at: NOW.add(1, 'day').toDate(), money: 100_000 },
        { at: NOW.add(2, 'day').toDate(), money: 100_000 },
        { at: NOW.add(3, 'day').toDate(), money: 100_000 },
        { at: NOW.add(4, 'day').toDate(), money: 100_000 },
        { at: NOW.add(5, 'day').toDate(), money: 100_000 },
        { at: NOW.add(6, 'day').toDate(), money: 100_000 },
        { at: NOW.add(7, 'day').toDate(), money: 100_000 },
        { at: NOW.add(8, 'day').toDate(), money: 100_000 },
        { at: NOW.add(9, 'day').toDate(), money: 100_000 },
        { at: NOW.add(10, 'day').toDate(), money: 100_000 },
      ];
      // when
      const res = calculateTotalHour(
        DUMMY_START,
        DUMMY_END,
        DUMMY_FIRST_MEETINGS,
      );
      // then
      expect(res).toEqual(0);
    });
  });
});

/**
 * reports.service.calculateTotalHour 함수의 db로직을 제거한 코드입니다.
 * 비즈니스 로직을 간편하게 테스트 하기 위해 생성했습니다.
 * reports.service.spect.ts는 제대로 시작되지 않기 때문에, 이 파일을 생성했습니다.
 */
function calculateTotalHour(
  start: Date,
  end: Date,
  firstMeetings: { at: Date; money: number }[],
): number {
  const MONTH_LIMIT = 1_000_000;
  const DAY_LIMIT = 400_000;
  const pay = 100_000;
  let money: number = Math.floor(getTotalHour([start, end])) * pay;
  let monthlyTotal = 0;
  let dailyTotal = 0;

  firstMeetings.forEach(i => {
    if (i.at.getMonth() === start.getMonth()) {
      // 12 월 필터
      monthlyTotal += i.money;
      if (i.at.getDate() === start.getDate()) {
        // 1~31 일 필터
        dailyTotal += i.money;
      }
    }
  });
  if (dailyTotal >= DAY_LIMIT || monthlyTotal >= MONTH_LIMIT) return 0;
  if (monthlyTotal + money >= MONTH_LIMIT) money = MONTH_LIMIT - monthlyTotal;
  if (dailyTotal + money >= DAY_LIMIT) money = DAY_LIMIT - dailyTotal;
  return money;
}
