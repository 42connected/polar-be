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

  async checkDate(startDate: Date, endDate: Date): Promise<boolean> {
    if (startDate.getFullYear() !== endDate.getFullYear()) {
      return false;
    }
    if (startDate.getMonth() !== endDate.getMonth()) {
      return false;
    }
    if (startDate.getDate() !== endDate.getDate()) {
      return false;
    }
    return true;
  }

  async checkTime(startDate: Date, endDate: Date): Promise<boolean> {
    if (startDate > endDate) {
      return false;
    }
    const startHour: number = startDate.getHours();
    const startMinute: number = startDate.getMinutes();
    const endHour: number = endDate.getHours();
    const endMinute: number = endDate.getMinutes();
    if (!(await this.checkDate(startDate, endDate))) {
      if (endHour === 0 && endMinute === 0) {
        if (startHour === 23 && startMinute === 30) {
          return false;
        }
      }
    } else {
      const endTotalMinute = endHour * 60 + endMinute;
      const startTotalMinute = startHour * 60 + startMinute;
      if (endTotalMinute - startTotalMinute < 60) {
        return false;
      }
    }
    return true;
  }

  async create(
    cadet: JwtUser,
    mentorId: string,
    createApplyDto: CreateApplyDto,
  ): Promise<boolean> {
    let findmentor: Mentors;
    let findcadet: Cadets;
    let tmpRepo: MentoringLogs;
    try {
      findmentor = await this.mentorsRepository.findOne({
        where: { intraId: mentorId },
      });
    } catch {
      throw new ConflictException('값을 가져오는 도중 오류가 발생했습니다.');
    }
    if (!findmentor) throw new NotFoundException(`${mentorId} not found.`);
    try {
      findcadet = await this.cadetsRepository.findOne({
        where: { id: cadet.id },
      });
    } catch {
      throw new ConflictException('값을 가져오는 도중 오류가 발생했습니다.');
    }
    if (!findcadet) throw new NotFoundException(`${cadet.id} here not found.`);
    if (
      !(await this.checkTime(
        createApplyDto.requestTime1[0],
        createApplyDto.requestTime1[1],
      ))
    )
      throw new BadRequestException(`time은 한시간 이상이어야 합니다.`);
    if (
      createApplyDto.requestTime2 &&
      !(await this.checkTime(
        createApplyDto.requestTime2[0],
        createApplyDto.requestTime2[1],
      ))
    )
      throw new BadRequestException(`time은 한시간 이상이어야 합니다.`);
    if (
      createApplyDto.requestTime3 &&
      !(await this.checkTime(
        createApplyDto.requestTime3[0],
        createApplyDto.requestTime3[1],
      ))
    )
      throw new BadRequestException(`time은 한시간 이상이어야 합니다.`);
    if (
      createApplyDto.requestTime1.length != 2 ||
      (createApplyDto.requestTime2 &&
        createApplyDto.requestTime2.length != 2) ||
      (createApplyDto.requestTime3 && createApplyDto.requestTime3.length != 2)
    )
      throw new BadRequestException();
    try {
      tmpRepo = this.mentoringlogsRepository.create({
        cadets: findcadet,
        mentors: findmentor,
        createdAt: new Date(),
        meetingAt: null,
        topic: createApplyDto.topic,
        content: createApplyDto.content,
        status: '대기중',
        rejectMessage: null,
        reportStatus: '대기중',
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
    const result = await this.checkDuplicatedTime(
      originRequestTimes,
      createApplyDto.requestTime1,
      createApplyDto.requestTime2,
      createApplyDto.requestTime3,
    );
    if (!result) {
      throw new ConflictException('이미 예약된 시간을 선택했습니다.');
    }
    try {
      await this.mentoringlogsRepository.save(tmpRepo);
    } catch {
      throw new ConflictException(
        '값을 repository에 저장하는 도중 오류가 발생했습니다.',
      );
    }
    return true;
  }

  async checkDuplicatedTime(
    originRequestTimes: Date[],
    requestTime1: Date[],
    requestTime2: Date[],
    requestTime3: Date[],
  ): Promise<boolean> {
    const len: number = originRequestTimes.length;
    for (let i = 0; i < len; i++) {
      if (
        requestTime1[0].getTime() >= originRequestTimes[i][0].getTime() &&
        requestTime1[0].getTime() <= originRequestTimes[i][1].getTime()
      )
        return false;
      if (
        requestTime2 &&
        requestTime2[0].getTime() >= originRequestTimes[i][0].getTime() &&
        requestTime2[0].getTime() <= originRequestTimes[i][1].getTime()
      )
        return false;
      if (
        requestTime3 &&
        requestTime3[0].getTime() >= originRequestTimes[i][0].getTime() &&
        requestTime3[0].getTime() <= originRequestTimes[i][1].getTime()
      )
        return false;
    }
    return true;
  }
}
