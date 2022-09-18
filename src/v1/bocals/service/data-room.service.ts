import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataRoomDto } from 'src/v1/dto/bocals/get-data-room.dto';
import { Reports } from 'src/v1/entities/reports.entity';
import { Between, Repository } from 'typeorm';
import { PaginationReportDto } from '../../dto/reports/pagination-report.dto';

@Injectable()
export class DataRoomService {
  constructor(
    @InjectRepository(Reports)
    private readonly reportsRepository: Repository<Reports>,
  ) {}

  getFromTo(date: string): Array<Date> {
    if (!date) {
      return [new Date(0), new Date()];
    }
    const from = new Date(date);
    const year = date.substring(0, 4);
    const nextMonth = (Number(date.substring(5)) + 1)
      .toString()
      .padStart(2, '0');
    const to = new Date(`${year}-${nextMonth}`);
    return [from, to];
  }

  async findAndCountReports(
    pagination: GetDataRoomDto,
  ): Promise<[Reports[], number]> {
    const [from, to] = this.getFromTo(pagination.date);
    try {
      return await this.reportsRepository.findAndCount({
        where: {
          mentors: {
            intraId: pagination.mentorIntra,
            name: pagination.mentorName,
          },
          mentoringLogs: {
            meetingStart: Between(from, to),
          },
          status: '완료',
        },
        relations: {
          mentoringLogs: true,
          cadets: true,
          mentors: true,
        },
        select: {
          id: true,
          place: true,
          createdAt: true,
          signatureUrl: true,
          imageUrl: true,
          money: true,
          status: true,
          mentoringLogs: {
            id: true,
            createdAt: true,
            meetingAt: true,
          },
          mentors: {
            intraId: true,
            name: true,
            duty: true,
          },
          cadets: {
            intraId: true,
            name: true,
            isCommon: true,
          },
        },
        order: {
          createdAt: pagination.isAscending ? 'ASC' : 'DESC',
        },
        skip: pagination.take * (pagination.page - 1),
        take: pagination.take,
      });
    } catch (e) {
      console.log(e);
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }

  async getReportPagination(
    getDataRoomDto: GetDataRoomDto,
  ): Promise<PaginationReportDto> {
    const result: [Reports[], number] = await this.findAndCountReports(
      getDataRoomDto,
    );
    return { reports: result[0], total: result[1] };
  }
}
