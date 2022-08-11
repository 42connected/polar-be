import { Bocals } from '../../entities/bocals.entity';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBocalDto } from 'src/v1/dto/bocals/create-bocals.dto';
import { jwtUser } from 'src/v1/interface/jwt-user.interface';
import { Repository } from 'typeorm';
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
    const worksheet = workbook.addWorksheet('Mentoring');

    worksheet.columns = [
      { header: '멘토명', key: 'mentorName', width: 10 },
      { header: '소속', key: 'mentorCompany', width: 20 },
      { header: '직급', key: 'mentorDuty', width: 20 },
      { header: '날짜', key: 'date', width: 15 },
      { header: '장소', key: 'place', width: 15 },
      { header: '멘토링 구분', key: 'isCommon', width: 10 },
      { header: '시작', key: 'startTime', width: 20 },
      { header: '종료', key: 'endTime', width: 20 },
      { header: '멘토링 시간', key: 'totalHour', width: 20 },
      { header: '멘토링 금액', key: 'money', width: 20 },
      { header: '멘티 이름', key: 'cadetName', width: 20 },
    ];

    for (const id of mentoringLogsId) {
      let row: MentoringInfo;
      try {
        row = await this.getOneMentoringInfo(id);
      } catch (error) {
        throw new ConflictException(error);
      }
      await worksheet.addRow(row);
    }

    res.writeHead(200, {
      'Content-Disposition': 'attachment; filename="file.xlsx"',
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    await workbook.xlsx.write(res).then(function () {
      res.end();
    });
  }

  async getOneMentoringInfo(mentoringLogId: string): Promise<MentoringInfo> {
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

    const mentoringHour: number = this.calculateTotalHour(
      mentoringLog.meetingAt[0],
      mentoringLog.meetingAt[1],
    );

    const result: MentoringInfo = {
      mentorName: mentoringLog.mentors.name,
      mentorCompany: mentoringLog.mentors.company,
      mentorDuty: mentoringLog.mentors.duty,
      date: mentoringLog.meetingAt[0].toISOString().split('T')[0],
      place: mentoringLog.reports.place,
      isCommon: mentoringLog.cadets.isCommon,
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

  calculateTotalHour(start: Date, end: Date): number {
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60));
  }
}

export interface MentoringInfo {
  mentorName: string;
  mentorCompany: string;
  mentorDuty: string;
  date: string;
  place: string;
  isCommon: boolean;
  startTime: string;
  endTime: string;
  totalHour: number;
  money: number;
  cadetName: string;
}
