import { Bocals } from '../../entities/bocals.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBocalDto } from 'src/v1/bocals/dto/create-bocals.dto';
import { JwtUser } from 'src/v1/interface/jwt-user.interface';
import { Repository } from 'typeorm';
import { MentoringExcelData } from 'src/v1/interface/bocals/mentoring-excel-data.interface';
import * as Excel from 'exceljs';
import { MONEY_PER_HOUR } from 'src/v1/reports/service/reports.service';
import { Reports } from 'src/v1/entities/reports.entity';

@Injectable()
export class BocalsService {
  constructor(
    @InjectRepository(Bocals) private bocalsRepository: Repository<Bocals>,
    @InjectRepository(Reports)
    private reportsRepository: Repository<Reports>,
  ) {}

  async updateLogin(bocal: Bocals, newData: CreateBocalDto): Promise<JwtUser> {
    bocal.intraId = newData.intraId;
    await this.bocalsRepository.save(bocal);
    return { id: bocal.id, intraId: bocal.intraId, role: 'bocal' };
  }

  async createUser(newData: CreateBocalDto): Promise<JwtUser> {
    try {
      const createdUser: Bocals = await this.bocalsRepository.create(newData);
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

  async findByIntra(intraId: string): Promise<Bocals> {
    try {
      const foundUser: Bocals = await this.bocalsRepository.findOneBy({
        intraId,
      });
      return foundUser;
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 검색 중 에러가 발생했습니다.',
      );
    }
  }

  async createMentoringExcelFile(reportIds: string[], response): Promise<void> {
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
        header: '멘토인트라',
        key: 'mentorIntraId',
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
    for (const id of reportIds) {
      const row: MentoringExcelData = await this.getOneMentoringInfo(id);
      if (!row) {
        throw new NotFoundException('엑셀 데이터 생성중 오류가 발생했습니다.');
      }
      await worksheet.addRow(row, 'o+');
    }

    try {
      await response.writeHead(201, {
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      await workbook.xlsx.write(response);
      response.end();
    } catch {
      throw new ConflictException('response 생성 중 오류가 발생했습니다.');
    }
  }

  async getOneMentoringInfo(reportId: string): Promise<MentoringExcelData> {
    let report: Reports;
    try {
      report = await this.reportsRepository.findOne({
        where: { id: reportId },
        relations: {
          mentors: true,
          cadets: true,
          mentoringLogs: true,
        },
      });
    } catch {
      throw new ConflictException('멘토링 정보를 찾는 중 오류가 발생했습니다.');
    }
    if (!report) {
      throw new NotFoundException('레포트를 찾을 수 없습니다.');
    }
    const result: MentoringExcelData = {
      mentorName: report.mentors.name,
      mentorIntraId: report.mentors.intraId,
      mentorCompany: report.mentors.company,
      mentorDuty: report.mentors.duty,
      date: NewDateKr(report.mentoringLogs.meetingAt[0]).toLocaleDateString(
        'ko-KR',
      ),
      place: report.place,
      isCommon: report.cadets.isCommon ? '공통' : '심화',
      startTime: NewDateKr(report.mentoringLogs.meetingAt[0])
        .toTimeString()
        .slice(
          0,
          report.mentoringLogs.meetingAt[0].toTimeString().lastIndexOf(':'),
        ),
      endTime: NewDateKr(report.mentoringLogs.meetingAt[1])
        .toTimeString()
        .slice(
          0,
          report.mentoringLogs.meetingAt[0].toTimeString().lastIndexOf(':'),
        ),
      totalHour: report.money / MONEY_PER_HOUR,
      money: report.money,
      cadetName: `${report.cadets.name}(${report.cadets.intraId}, ${report.extraCadets})`,
    };
    return result;
  }

  async patchReportStatusToEdit(reportIdArray: string[]): Promise<boolean> {
    let report: Reports;
    reportIdArray.forEach(async element => {
      try {
        report = await this.reportsRepository.findOne({
          where: { id: element },
          relations: {
            mentors: true,
            cadets: true,
            mentoringLogs: true,
          },
        });
      } catch {
        throw new ConflictException(
          '멘토링 정보를 찾는 중 오류가 발생했습니다.',
        );
      }
      if (!report) {
        throw new NotFoundException('레포트를 찾을 수 없습니다.');
      }
      report.status = '수정기간';
      this.reportsRepository.save(report);
    });
    return true;
  }

  async patchReportStatusToDone(reportIdArray: string[]): Promise<boolean> {
    let report: Reports;
    reportIdArray.forEach(async element => {
      try {
        report = await this.reportsRepository.findOne({
          where: { id: element },
          relations: {
            mentors: true,
            cadets: true,
            mentoringLogs: true,
          },
        });
      } catch {
        throw new ConflictException(
          '멘토링 정보를 찾는 중 오류가 발생했습니다.',
        );
      }
      if (!report) {
        throw new NotFoundException('레포트를 찾을 수 없습니다.');
      }
      report.status = '작성완료';
      this.reportsRepository.save(report);
    });
    return true;
  }

  async patchAllReportStatusToEdit(): Promise<boolean> {
    let reports: Reports[];
    try {
      reports = await this.reportsRepository.find({
        where: { status: '작성완료' },
      });
    } catch {
      throw new ConflictException('레포트 정보를 찾는 중 오류가 발생했습니다.');
    }
    reports.forEach(async element => {
      element.status = '수정기간';
      this.reportsRepository.save(element);
    });
    return true;
  }

  async patchAllReportStatusToDone(): Promise<boolean> {
    let reports: Reports[];
    try {
      reports = await this.reportsRepository.find({
        where: { status: '수정기간' },
      });
    } catch {
      throw new ConflictException('레포트 정보를 찾는 중 오류가 발생했습니다.');
    }
    reports.forEach(async element => {
      element.status = '작성완료';
      this.reportsRepository.save(element);
    });
    return true;
  }
}

function StringToDateKr(dateString: string): Date {
  const localDate = new Date(dateString);
  const utcDate =
    localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000;
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const koreaDate = new Date(utcDate + koreaTimeDiff);
  return koreaDate;
}

function NumToDateKr(
  year: number,
  month: number,
  day: number,
  hour?: number,
  minute?: number,
): Date {
  let localDate;
  if (hour && minute) localDate = new Date(year, month, day, hour, minute);
  else localDate = new Date(year, month, day);
  const utcDate =
    localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000;
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const koreaDate = new Date(utcDate + koreaTimeDiff);
  return koreaDate;
}

function NewDateKr(date: Date): Date {
  const localDate = new Date(date);
  const utcDate =
    localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000;
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const koreaDate = new Date(utcDate + koreaTimeDiff);
  return koreaDate;
}

function NowDateKr(): Date {
  const localDate = new Date();
  const utcDate =
    localDate.getTime() + localDate.getTimezoneOffset() * 60 * 1000;
  const koreaTimeDiff = 9 * 60 * 60 * 1000;
  const koreaDate = new Date(utcDate + koreaTimeDiff);
  return koreaDate;
}
