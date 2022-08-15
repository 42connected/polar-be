import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MentoringLogsService {
  constructor(
    @InjectRepository(MentoringLogs)
    private mentoringLogsRepository: Repository<MentoringLogs>,
  ) {}

  async findMentoringLogWithRelations(id: string): Promise<MentoringLogs> {
    try {
      const foundLog: MentoringLogs =
        await this.mentoringLogsRepository.findOne({
          where: { id },
          relations: {
            mentors: true,
            cadets: true,
          },
        });
      return foundLog;
    } catch (err) {
      throw new ConflictException(
        err,
        '멘토링 로그 검색 중 에러가 발생했습니다.',
      );
    }
  }

  async approve(
    mentoringLogId: string,
    userId: string,
  ): Promise<MentoringLogs> {
    const foundLog: MentoringLogs = await this.findMentoringLogWithRelations(
      mentoringLogId,
    );
    if (userId !== foundLog.mentors.intraId) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: '멘토링 로그에 대한 처리 권한이 없습니다.',
        },
        HttpStatus.FORBIDDEN,
      );
    }
    foundLog.status = '확정';
    try {
      await this.mentoringLogsRepository.save(foundLog);
    } catch (err) {
      throw new ConflictException('멘토링 로그 저장 중 에러가 발생했습니다.');
    }
    return foundLog;
  }
}
