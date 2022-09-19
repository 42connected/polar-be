import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplyDto } from '../../dto/cadets/create-apply.dto';
import { Cadets } from '../../entities/cadets.entity';
import { Mentors } from '../../entities/mentors.entity';
import { CalendarService } from 'src/v1/calendar/service/calendar.service';
import { MentoringLogStatus } from 'src/v1/mentoring-logs/service/mentoring-logs.service';
import { getKSTDate } from 'src/util/utils';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(MentoringLogs)
    private readonly mentoringlogsRepository: Repository<MentoringLogs>,
    private calendarService: CalendarService,
  ) {}

  checkDate(startDate: Date, endDate: Date): void {
    if (
      startDate.getUTCFullYear() !== endDate.getUTCFullYear() ||
      startDate.getUTCMonth() !== endDate.getUTCMonth() ||
      startDate.getUTCDate() !== endDate.getUTCDate()
    ) {
      throw new BadRequestException('멘토링은 당일에 종료되어야 합니다.');
    }
    if (endDate.getTime() - startDate.getTime() > 1000 * 60 * 60 * 3) {
      throw new BadRequestException(
        '멘토링은 한번에 최대 3시간까지 신청 가능합니다.',
      );
    }
  }

  checkUnitTime(startDate: Date, endDate: Date): void {
    const errorMessage = `멘토링 진행 시간은 한시간 이상이어야 합니다.`;
    if (startDate > endDate) {
      throw new BadRequestException(errorMessage);
    }
    const startHour: number = startDate.getUTCHours();
    const startMinute: number = startDate.getUTCMinutes();
    const endHour: number = endDate.getUTCHours();
    const endMinute: number = endDate.getUTCMinutes();
    if (
      (startMinute !== 0 && startMinute !== 30) ||
      (endMinute !== 0 && endMinute !== 30)
    ) {
      throw new BadRequestException('정각 혹은 30분만 신청 가능합니다.');
    }
    if (endHour === 0 && endMinute === 0) {
      if (startHour === 23 && startMinute === 30) {
        throw new BadRequestException(errorMessage);
      }
    } else {
      const endTotalMinute = endHour * 60 + endMinute;
      const startTotalMinute = startHour * 60 + startMinute;
      if (endTotalMinute - startTotalMinute < 60) {
        throw new BadRequestException(errorMessage);
      }
    }
  }

  checkStartToEnd(startDate: Date, endDate: Date): void {
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const erroMessage = '시작 시간이 끝나는 시간보다 느립니다.';
    if (startTime >= endTime) {
      throw new BadRequestException(erroMessage);
    }
  }

  checkTime(startDate: Date, endDate: Date): void {
    this.checkDate(startDate, endDate);
    this.checkUnitTime(startDate, endDate);
    this.checkStartToEnd(startDate, endDate);
  }

  checkSameTime(time1: Date[], time2: Date[]) {
    const time1Start = time1[0].getTime();
    const time1End = time1[1].getTime();
    const time2Start = time2[0].getTime();
    const time2End = time2[1].getTime();
    if (time1Start === time2Start && time1End === time2End) {
      throw new BadRequestException('시간이 겹칩니다.');
    }
  }

  checkAvailableTime(requestTimesKST: Date[][]): void {
    this.checkTime(requestTimesKST[0][0], requestTimesKST[0][1]);
    if (requestTimesKST[1]) {
      this.checkTime(requestTimesKST[1][0], requestTimesKST[1][1]);
      this.checkSameTime(requestTimesKST[0], requestTimesKST[1]);
      if (requestTimesKST[2]) {
        this.checkTime(requestTimesKST[2][0], requestTimesKST[2][1]);
        this.checkSameTime(requestTimesKST[0], requestTimesKST[2]);
        this.checkSameTime(requestTimesKST[1], requestTimesKST[2]);
      }
    }
  }

  formatRequestTimes(createApplyDto: CreateApplyDto): Date[][] {
    const requestTimesKST: Date[][] = [];
    requestTimesKST.push([
      getKSTDate(createApplyDto.requestTime1[0]),
      getKSTDate(createApplyDto.requestTime1[1]),
    ]);
    if (createApplyDto.requestTime2) {
      requestTimesKST.push([
        getKSTDate(createApplyDto.requestTime2[0]),
        getKSTDate(createApplyDto.requestTime2[1]),
      ]);
      if (createApplyDto.requestTime3) {
        requestTimesKST.push([
          getKSTDate(createApplyDto.requestTime3[0]),
          getKSTDate(createApplyDto.requestTime3[1]),
        ]);
      }
    }
    return requestTimesKST;
  }

  async create(
    cadet: Cadets,
    mentor: Mentors,
    createApplyDto: CreateApplyDto,
  ): Promise<MentoringLogs> {
    const requestTimesKST: Date[][] = this.formatRequestTimes(createApplyDto);
    this.checkAvailableTime(requestTimesKST);
    const originRequestTimes = await this.calendarService.getRequestTimes(
      mentor.intraId,
    );
    if (originRequestTimes) {
      const result = await this.checkDuplicatedTime(
        originRequestTimes,
        createApplyDto,
      );
      if (!result) {
        throw new ConflictException('이미 예약된 시간을 선택했습니다.');
      }
    }
    try {
      const createdLog: MentoringLogs = this.mentoringlogsRepository.create({
        cadets: cadet,
        mentors: mentor,
        createdAt: new Date(),
        meetingAt: null,
        topic: createApplyDto.topic,
        content: createApplyDto.content,
        status: MentoringLogStatus.Wait,
        rejectMessage: null,
        requestTime1: createApplyDto.requestTime1,
        requestTime2: createApplyDto.requestTime2,
        requestTime3: createApplyDto.requestTime3,
      });
      await this.mentoringlogsRepository.save(createdLog);
      return createdLog;
    } catch {
      throw new ConflictException(
        '값을 repository에 저장하는 도중 오류가 발생했습니다.',
      );
    }
  }

  checkTimeOverlap(requestTime: Date[], originTime: Date[]) {
    if (!requestTime) {
      return true;
    }
    if (
      requestTime[0].getTime() >= originTime[1].getTime() ||
      requestTime[1].getTime() <= originTime[0].getTime()
    ) {
      return true;
    }
    return false;
  }

  async checkDuplicatedTime(
    originRequestTimes: Date[][],
    createApplyDto: CreateApplyDto,
  ): Promise<boolean> {
    const results: boolean[] = originRequestTimes.map(originTime => {
      if (
        !this.checkTimeOverlap(createApplyDto.requestTime1, originTime) ||
        !this.checkTimeOverlap(createApplyDto.requestTime2, originTime) ||
        !this.checkTimeOverlap(createApplyDto.requestTime3, originTime)
      ) {
        return false;
      }
      return true;
    });
    return results.every(result => result);
  }
}
