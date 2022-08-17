import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { MentoringLogs } from '../../entities/mentoring-logs.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplyDto } from '../../dto/cadets/create-apply.dto';
import { Cadets } from '../../entities/cadets.entity';
import { Mentors } from '../../entities/mentors.entity';
import { JwtUser } from 'src/v1/interface/jwt-user.interface';
import { CalendarService } from 'src/v1/calendar/service/calendar.service';
import { MentoringLogStatus } from 'src/v1/mentoring-logs/service/mentoring-logs.service';

@Injectable()
export class ApplyService {
  constructor(
    @InjectRepository(MentoringLogs)
    private readonly mentoringlogsRepository: Repository<MentoringLogs>,
    @InjectRepository(Mentors)
    private readonly mentorsRepository: Repository<Mentors>,
    @InjectRepository(Cadets)
    private readonly cadetsRepository: Repository<Cadets>,
    private calendarService: CalendarService,
  ) {}

  checkDate(startDate: Date, endDate: Date): void {
    const errorMessage = '멘토링은 당일에 종료되어야 합니다.';
    if (startDate.getFullYear() !== endDate.getFullYear()) {
      throw new BadRequestException(errorMessage);
    }
    if (startDate.getMonth() !== endDate.getMonth()) {
      throw new BadRequestException(errorMessage);
    }
    if (startDate.getDate() !== endDate.getDate()) {
      throw new BadRequestException(errorMessage);
    }
    this.checkTime(startDate, endDate);
  }

  checkTime(startDate: Date, endDate: Date): void {
    const errorMessage = `멘토링 진행 시간은 한시간 이상이어야 합니다.`;
    if (startDate > endDate) {
      throw new BadRequestException(errorMessage);
    }
    const startHour: number = startDate.getHours();
    const startMinute: number = startDate.getMinutes();
    const endHour: number = endDate.getHours();
    const endMinute: number = endDate.getMinutes();
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
    this.checkTime(startDate, endDate);
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

  checkAvailableTime(createApplyDto: CreateApplyDto): void {
    this.checkTime(
      createApplyDto.requestTime1[0],
      createApplyDto.requestTime1[1],
    );
    if (createApplyDto.requestTime2) {
      this.checkTime(
        createApplyDto.requestTime2[0],
        createApplyDto.requestTime2[1],
      );
      this.checkSameTime(
        createApplyDto.requestTime1,
        createApplyDto.requestTime2,
      );
      if (createApplyDto.requestTime3) {
        this.checkTime(
          createApplyDto.requestTime3[0],
          createApplyDto.requestTime3[1],
        );
        this.checkSameTime(
          createApplyDto.requestTime1,
          createApplyDto.requestTime3,
        );
        this.checkSameTime(
          createApplyDto.requestTime2,
          createApplyDto.requestTime3,
        );
    }
    }
  }

  async create(
    cadet: JwtUser,
    mentorId: string,
    createApplyDto: CreateApplyDto,
  ): Promise<MentoringLogs> {
    let findMentor: Mentors;
    let findCadet: Cadets;
    let createdLog: MentoringLogs;
    try {
      findMentor = await this.mentorsRepository.findOne({
        where: { intraId: mentorId },
      });
    } catch {
      throw new ConflictException(
        `${mentorId}값을 가져오는 도중 오류가 발생했습니다.`,
      );
    }
    if (!findMentor) {
      throw new ConflictException(`${mentorId}의 멘토링을 찾을 수 없습니다.`);
    }
    try {
      findCadet = await this.cadetsRepository.findOne({
        where: { id: cadet.id },
      });
    } catch {
      throw new ConflictException(
        `${cadet.intraId}값을 가져오는 도중 오류가 발생했습니다.`,
      );
    }
    if (!findCadet) {
      throw new ConflictException(
        `${cadet.intraId}값을 가져오는 도중 오류가 발생했습니다.`,
      );
    }
    this.checkAvailableTime(createApplyDto);
    try {
      createdLog = this.mentoringlogsRepository.create({
        cadets: findCadet,
        mentors: findMentor,
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
    } catch {
      throw new ConflictException(
        '값을 repository에 생성하는 도중 오류가 발생했습니다.',
      );
    }
    const originRequestTimes = await this.calendarService.getRequestTimes(
      mentorId,
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
      await this.mentoringlogsRepository.save(createdLog);
    } catch {
      throw new ConflictException(
        '값을 repository에 저장하는 도중 오류가 발생했습니다.',
      );
    }
    return createdLog;
  }

  async checkDuplicatedTime(
    originRequestTimes: Date[],
    createApplyDto: CreateApplyDto,
  ): Promise<boolean> {
    const len: number = originRequestTimes.length;
    const requestTime1Start = createApplyDto.requestTime1[0].getTime();
    const requestTime1End = createApplyDto.requestTime1[1].getTime();
    let requestTime2Start = 0;
    let requestTime2End = 0;
    let requestTime3Start = 0;
    let requestTime3End = 0;
    if (createApplyDto.requestTime2) {
      requestTime2Start = createApplyDto.requestTime2[0].getTime();
      requestTime2End = createApplyDto.requestTime2[1].getTime();
      if (createApplyDto.requestTime3) {
        requestTime3Start = createApplyDto.requestTime3[0].getTime();
        requestTime3End = createApplyDto.requestTime3[1].getTime();
      }
    }
    console.log(originRequestTimes[1][0]);
    for (let i = 0; i < len; i++) {
      if (
        requestTime1Start >= originRequestTimes[i][0].getTime() &&
        requestTime1End <= originRequestTimes[i][1].getTime()
      ) {
        return false;
      }
      if (
        createApplyDto.requestTime2 &&
        requestTime2Start >= originRequestTimes[i][0].getTime() &&
        requestTime2End <= originRequestTimes[i][1].getTime()
      )
        return false;
      if (
        createApplyDto.requestTime3 &&
        createApplyDto.requestTime2 &&
        requestTime3Start >= originRequestTimes[i][0].getTime() &&
        requestTime3End <= originRequestTimes[i][1].getTime()
      )
        return false;
    }
    return true;
  }
}
