import { Bocals } from '../../entities/bocals.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBocalDto } from 'src/v1/dto/bocals/create-bocals.dto';
import { jwtUser } from 'src/v1/interface/jwt-user.interface';
import { Raw, Repository } from 'typeorm';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import * as Excel from 'exceljs';

@Injectable()
export class BocalsService {
  constructor(
    @InjectRepository(Bocals) private bocalsRepository: Repository<Bocals>,
    @InjectRepository(MentoringLogs)
    private mentoringLogsRepository: Repository<MentoringLogs>,
  ) {}

  async createUser(user: CreateBocalDto): Promise<jwtUser> {
    try {
      const createdUser: Bocals = await this.bocalsRepository.create(user);
      await this.bocalsRepository.save(createdUser);
      return {
        id: createdUser.id,
        intraId: createdUser.intraId,
        role: 'bocal',
      };
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 생성 중 에러가 발생했습니다.',
      );
    }
  }

  async findByIntra(intraId: string): Promise<jwtUser> {
    try {
      const foundUser: Bocals = await this.bocalsRepository.findOneBy({
        intraId,
      });
      return { id: foundUser?.id, intraId: foundUser?.intraId, role: 'cadet' };
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 검색 중 에러가 발생했습니다.',
      );
    }
  }

  async createMentoringExcelFile(mentoringLogsId: string[], res) {
    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('Mentoring', {
      views: [
        {
          state: 'frozen',
          ySplit: 1,
          activeCell: 'B1',
        },
      ],
      properties: { defaultRowHeight: 20 },
    });

    worksheet.columns = [
      {
        header: '멘토명',
        key: 'mentorName',
        width: 10,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: '소속',
        key: 'mentorCompany',
        width: 20,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: '직급',
        key: 'mentorDuty',
        width: 15,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: '날짜',
        key: 'date',
        width: 15,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: '장소',
        key: 'place',
        width: 15,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: '멘토링 구분',
        key: 'isCommon',
        width: 13,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: '시작',
        key: 'startTime',
        width: 10,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: '종료',
        key: 'endTime',
        width: 10,
        style: { alignment: { horizontal: 'center' } },
      },
      {
        header: '멘토링 시간',
        key: 'totalHour',
        width: 13,
        style: { alignment: { horizontal: 'right' } },
      },
      {
        header: '멘토링 금액',
        key: 'money',
        width: 13,
        style: { alignment: { horizontal: 'right' }, numFmt: '#,##0' },
      },
      {
        header: '멘티명',
        key: 'cadetName',
        width: 10,
        style: { alignment: { horizontal: 'center' } },
      },
    ];

    worksheet.getRow(1).eachCell(cell => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });
    for (const id of mentoringLogsId) {
      let row: MentoringExcelData;
      try {
        row = await this.getOneMentoringInfo(id);
      } catch (error) {
        throw new ConflictException(error);
      }
      if (!row)
        throw new NotFoundException('엑셀 데이터 생성중 오류가 발생했습니다.');
      await worksheet.addRow(row, 'o+');
    }

    //2022-09_m-engeng_mentoringdata_220812.xlsx 이런 느낌으로 할까 생각중
    //2022-09_mentoringdata_220812.xlsx
    //m-engeng_mengoringdata_220812.xlsx
    //무작위는 모르겠당
    const fileName: string = new Date().getTime().toString(36);

    res.writeHead(200, {
      'Content-Disposition': `attachment; filename=mentoring_data-${fileName}.xlsx`,
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    await workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  async getOneMentoringInfo(
    mentoringLogId: string,
  ): Promise<MentoringExcelData> {
    let mentoringLog: MentoringLogs;
    try {
      mentoringLog = await this.mentoringLogsRepository.findOne({
        where: { id: mentoringLogId },
        relations: {
          mentors: true,
          cadets: true,
          reports: true,
        },
      });
    } catch {
      throw new ConflictException('멘토링 정보를 찾는 중 오류가 발생했습니다.');
    }
    if (!mentoringLog)
      throw new NotFoundException('잘못된 멘토링 아이디입니다.');

    const mentoringHour: number = await this.calculateTotalHour(
      mentoringLogId,
      mentoringLog.meetingAt[0],
      mentoringLog.meetingAt[1],
    );

    const result: MentoringExcelData = {
      mentorName: mentoringLog.mentors.name,
      mentorCompany: mentoringLog.mentors.company,
      mentorDuty: mentoringLog.mentors.duty,
      date: mentoringLog.meetingAt[0].toISOString().split('T')[0],
      place: mentoringLog.reports.place,
      isCommon: mentoringLog.cadets.isCommon ? '공통' : '심화',
      startTime: mentoringLog.meetingAt[0]
        .toISOString()
        .split('T')[1]
        .substr(0, 5),
      endTime: mentoringLog.meetingAt[1]
        .toISOString()
        .split('T')[1]
        .substr(0, 5),
      totalHour: mentoringHour,
      money: mentoringHour * 100000,
      cadetName: mentoringLog.cadets.name,
    };
    return result;
  }

  async calculateTotalHour(
    mentorId: string,
    start: Date,
    end: Date,
  ): Promise<number> {
    let finishedMentorings: MentoringLogs[] = [];
    const finishedMentoringsInDay: MentoringLogs[] = [];
    const finishedMentoringsInMonth: MentoringLogs[] = [];

    let result: number = Math.floor(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60),
    );

    //가정: 리포트가 작성이 완료되었을 때 저장과 동시에 실행됨
    //이 때, reportStatus는 '작성완료'가 아님 (이건 로직에 따라 변경가능)
    //
    finishedMentorings = await this.mentoringLogsRepository.find({
      select: { meetingAt: true },
      //FIX ME:mentoringStatus가 완료가 되어야 함
      where: { reportStatus: '작성완료', mentors: { id: mentorId } },
      relations: { mentors: true },
    });

    finishedMentorings.map(mentoring => {
      if (mentoring.meetingAt[0].getMonth() === start.getMonth())
        finishedMentoringsInMonth.push(mentoring);
    });

    finishedMentoringsInMonth.map(mentoring => {
      if (mentoring.meetingAt[0].getDate() === start.getDate())
        finishedMentoringsInDay.push(mentoring);
    });

    let mentoringTimePerDay = 0;
    finishedMentoringsInDay.forEach(mentoring => {
      mentoringTimePerDay += Math.floor(
        (mentoring.meetingAt[1].getTime() - mentoring.meetingAt[0].getTime()) /
          (1000 * 60 * 60),
      );
    });
    if (mentoringTimePerDay >= 4) return 0;
    else if (mentoringTimePerDay + result >= 4)
      result = 4 - mentoringTimePerDay;

    let mentoringTimePerMonth = 0;
    finishedMentoringsInMonth.forEach(mentoring => {
      mentoringTimePerMonth += Math.floor(
        (mentoring.meetingAt[1].getTime() - mentoring.meetingAt[0].getTime()) /
          (1000 * 60 * 60),
      );
    });
    if (mentoringTimePerMonth >= 10) return 0;
    else if (mentoringTimePerMonth + result >= 10)
      result = 10 - mentoringTimePerDay;

    return result;
  }
}

export interface MentoringExcelData {
  mentorName: string;
  mentorCompany: string;
  mentorDuty: string;
  date: string;
  place: string;
  isCommon: string;
  startTime: string;
  endTime: string;
  totalHour: number;
  money: number;
  cadetName: string;
}
