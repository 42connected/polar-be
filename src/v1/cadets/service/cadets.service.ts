import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CadetMentoringLogs } from 'src/v1/dto/cadet-mentoring-logs.interface';
import { CreateCadetDto } from 'src/v1/dto/cadets/create-cadet.dto';
import { UpdateCadetDto } from 'src/v1/dto/cadets/update-cadet.dto';
import { JwtUser } from 'src/v1/interface/jwt-user.interface';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';
import { Repository } from 'typeorm';
import { MentoringInfoDto } from 'src/v1/dto/cadets/mentoring-info.dto';
import { MentoringLogStatus } from 'src/v1/mentoring-logs/service/mentoring-logs.service';
import { Reports } from 'src/v1/entities/reports.entity';
import { ReportStatus, REPORT_STATUS_STR } from 'src/v1/reports/ReportStatus';

@Injectable()
export class CadetsService {
  constructor(
    @InjectRepository(Cadets) private cadetsRepository: Repository<Cadets>,
    @InjectRepository(Reports) private reportsRepository: Repository<Reports>,
  ) {}

  async updateLogin(cadet: Cadets, newData: CreateCadetDto): Promise<JwtUser> {
    cadet.intraId = newData.intraId;
    cadet.profileImage = newData.profileImage;
    cadet.isCommon = newData.isCommon;
    cadet.email = newData.email;
    await this.cadetsRepository.save(cadet);
    return { id: cadet.id, intraId: cadet.intraId, role: 'cadet' };
  }

  async createUser(user: CreateCadetDto): Promise<JwtUser> {
    try {
      const createdUser: Cadets = await this.cadetsRepository.create(user);
      await this.cadetsRepository.save(createdUser);
      return {
        id: createdUser.id,
        intraId: createdUser.intraId,
        role: 'cadet',
      };
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 생성 중 에러가 발생했습니다.',
      );
    }
  }

  async findByIntra(intraId: string): Promise<Cadets> {
    try {
      const foundUser: Cadets = await this.cadetsRepository.findOneBy({
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

  async findCadetByIntraId(intraId: string): Promise<Cadets> {
    let foundUser: Cadets;
    try {
      foundUser = await this.cadetsRepository.findOneBy({
        intraId,
      });
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 검색 중 에러가 발생했습니다.',
      );
    }
    if (!foundUser) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    return foundUser;
  }

  formatMentorings(
    logs: MentoringLogs[],
    isCommon: boolean,
  ): CadetMentoringLogs[] {
    return logs.map(mentoring => {
      return {
        id: mentoring.id,
        mentor: {
          intraId: mentoring.mentors.intraId,
          name: mentoring.mentors.name,
        },
        createdAt: mentoring.createdAt,
        status: mentoring.status,
        topic: mentoring.topic,
        meta: {
          isCommon,
          content: mentoring.content,
          requestTime: [
            mentoring.requestTime1,
            mentoring.requestTime2,
            mentoring.requestTime3,
          ],
          meetingAt: mentoring.meetingAt,
          rejectMessage: mentoring.rejectMessage,
          feedbackMessage: null,
        },
      };
    });
  }

  async addFeedbackMsgToLogs(
    formatLogs: CadetMentoringLogs[],
  ): Promise<CadetMentoringLogs[]> {
    for (const [i, logs] of formatLogs.entries()) {
      if (logs.status === MentoringLogStatus.Done) {
        const report = await this.reportsRepository.findOne({
          where: { mentoringLogs: { id: logs.id } },
        });
        if (report?.status === '작성완료' && report?.feedbackMessage) {
          formatLogs[i].meta.feedbackMessage = report.feedbackMessage;
        }
      }
    }
    return formatLogs;
  }

  async getMentoringLogs(intraId: string): Promise<MentoringInfoDto> {
    let cadet: Cadets;
    try {
      cadet = await this.cadetsRepository.findOne({
        where: { intraId },
        relations: { mentoringLogs: { mentors: true } },
        order: {
          mentoringLogs: {
            createdAt: 'DESC',
          },
        },
      });
    } catch (err) {
      throw new ConflictException(
        err,
        '멘토링 데이터 검색 중 에러가 발생했습니다.',
      );
    }
    if (cadet === null) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }
    let mentorings: CadetMentoringLogs[] = this.formatMentorings(
      cadet.mentoringLogs,
      cadet.isCommon,
    );
    mentorings = await this.addFeedbackMsgToLogs(mentorings);
    return { username: cadet.name, resumeUrl: cadet.resumeUrl, mentorings };
  }

  validateInfo(cadet: Cadets): boolean {
    if (!cadet.name) {
      return false;
    }
    return true;
  }

  async saveName(intraId: string, name: string): Promise<void> {
    if (name === '') {
      throw new BadRequestException('입력된 이름이 없습니다.');
    }
    const foundUser: Cadets = await this.findCadetByIntraId(intraId);
    try {
      foundUser.name = name;
      await this.cadetsRepository.save(foundUser);
    } catch (err) {
      throw new ConflictException(err, '예기치 못한 에러가 발생하였습니다');
    }
  }

  async updateCadet(cadetIntraId: string, updateCadetDto: UpdateCadetDto) {
    const cadet: Cadets = await this.findCadetByIntraId(cadetIntraId);
    cadet.resumeUrl = updateCadetDto.resumeUrl;
    try {
      await this.cadetsRepository.save(cadet);
    } catch {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }
}
