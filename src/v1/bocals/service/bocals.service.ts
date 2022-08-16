import { Bocals } from '../../entities/bocals.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBocalDto } from 'src/v1/dto/bocals/create-bocals.dto';
import { JwtUser } from 'src/v1/interface/jwt-user.interface';
import { Repository } from 'typeorm';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { MentoringExcelData } from 'src/v1/interface/bocals/mentoring-excel-data.interface';
import * as Excel from 'exceljs';
import { Response } from 'express';

@Injectable()
export class BocalsService {
  constructor(
    @InjectRepository(Bocals) private bocalsRepository: Repository<Bocals>,
    @InjectRepository(MentoringLogs)
    private mentoringLogsRepository: Repository<MentoringLogs>,
  ) {}

  async createUser(user: CreateBocalDto): Promise<JwtUser> {
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

  async findByIntra(intraId: string): Promise<JwtUser> {
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

  async createMentoringExcelFile(
    mentoringLogsId: string[],
    response: Response,
  ): Promise<boolean> {
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
      {
        header: '멘티인트라',
        key: 'cadetIntraId',
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
      if (!row) {
        throw new NotFoundException('엑셀 데이터 생성중 오류가 발생했습니다.');
      }
      await worksheet.addRow(row, 'o+');
    }

    const fileName: string = new Date().toISOString().split('T')[0];
    try {
      await response.writeHead(200, {
        'Content-Disposition': `attachment; filename=mentoring-data_${fileName}.xlsx`,
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      await workbook.xlsx.write(response);
    } catch {
      throw new ConflictException('response 생성 중 오류가 발생했습니다.');
    }
    return true;
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
    if (!mentoringLog) {
      throw new NotFoundException('잘못된 멘토링 아이디입니다.');
    }

    const result: MentoringExcelData = {
      mentorName: mentoringLog.mentors.name,
      metorIntraId: mentoringLog.mentors.intraId,
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
      totalHour: mentoringLog.money / 100000,
      money: mentoringLog.money,
      cadetName: mentoringLog.cadets.name,
      cadetIntraId: mentoringLog.cadets.intraId,
    };
    return result;
  }
}
