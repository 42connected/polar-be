import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataRoomDto } from 'src/v1/dto/bocals/get-data-room.dto';
import { Reports } from 'src/v1/entities/reports.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DataRoomService {
  constructor(
    @InjectRepository(Reports)
    private readonly reportsRepository: Repository<Reports>,
  ) {}
  async getReportPagination(
    getDataRoomDto: GetDataRoomDto,
  ): Promise<[Reports[], number]> {
    try {
      const reports: [Reports[], number] =
        await this.reportsRepository.findAndCount({
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
            },
          },
          order: {
            createdAt: getDataRoomDto.isAscending ? 'ASC' : 'DESC',
          },
          skip: getDataRoomDto.take * (getDataRoomDto.page - 1),
          take: getDataRoomDto.take,
        });

      if (getDataRoomDto.mentorIntra) {
        reports[0] = reports[0].filter(
          report => report.mentors.intraId === getDataRoomDto.mentorIntra,
        );
      }
      if (getDataRoomDto.mentorName) {
        reports[0] = reports[0].filter(
          report => report.mentors.name === getDataRoomDto.mentorName,
        );
      }
      return reports;
    } catch (e) {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }
}
