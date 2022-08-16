import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetDataRoomDto } from 'src/v1/dto/bocals/get-data-room.dto';
import { Reports } from 'src/v1/entities/reports.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DataroomService {
  constructor(
    @InjectRepository(Reports)
    private readonly reportsRepository: Repository<Reports>,
  ) {}
  async getReportPagination(
    getDataroomDto: GetDataRoomDto,
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
            mentoringLogs: {
              id: true,
              createdAt: true,
              meetingAt: true,
              money: true,
              reportStatus: true,
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
            createdAt: getDataroomDto.isAscending ? 'ASC' : 'DESC',
          },
          skip: getDataroomDto.take * (getDataroomDto.page - 1),
          take: getDataroomDto.take,
        });

      if (getDataroomDto.mentorIntra) {
        reports[0] = reports[0].filter(
          report => report.mentors.intraId === getDataroomDto.mentorIntra,
        );
      }
      if (getDataroomDto.mentorName) {
        reports[0] = reports[0].filter(
          report => report.mentors.name === getDataroomDto.mentorName,
        );
      }
      return reports;
    } catch (e) {
      console.log(e);
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }
}
