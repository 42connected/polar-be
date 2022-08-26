import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataRoomDto } from 'src/v1/dto/bocals/get-data-room.dto';
import { Reports } from 'src/v1/entities/reports.entity';
import { Repository } from 'typeorm';
import { PaginationReportDto } from '../../dto/reports/pagination-report.dto';

@Injectable()
export class DataRoomService {
  constructor(
    @InjectRepository(Reports)
    private readonly reportsRepository: Repository<Reports>,
  ) {}

  async findAndCountReports(
    pagination: GetDataRoomDto,
  ): Promise<[Reports[], number]> {
    try {
      return await this.reportsRepository.findAndCount({
        where: {
          mentors: {
            intraId: pagination.mentorIntra,
            name: pagination.mentorName,
          },
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
