import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { jwtUser } from 'src/v1/dto/jwt-user.interface';
import { UpdateMentorDatailDto } from 'src/v1/dto/mentors/mentor-detail.dto';
import { CreateMentorDto } from 'src/v1/dto/mentors/create-mentor.dto';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';
import { availableTimeDto } from 'src/v1/dto/available-time.dto';
import { Comments } from 'src/v1/entities/comments.entity';
import { MentoringLogs } from 'src/v1/entities/mentoring-logs.entity';

@Injectable()
export class MentorsService {
  constructor(
    @InjectRepository(Mentors)
    private readonly mentorsRepository: Repository<Mentors>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(MentoringLogs)
    private readonly mentoringLogsRepository: Repository<MentoringLogs>,
  ) {}

  async createUser(user: CreateMentorDto): Promise<jwtUser> {
    try {
      const createdUser: Mentors = this.mentorsRepository.create(user);
      createdUser.isActive = false;
      await this.mentorsRepository.save(createdUser);
      return {
        id: createdUser.id,
        intraId: createdUser.intraId,
        role: 'mentor',
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
      const foundUser: Mentors = await this.mentorsRepository.findOneBy({
        intraId,
      });
      return { id: foundUser?.id, intraId: foundUser?.intraId, role: 'mentor' };
    } catch (err) {
      throw new ConflictException(
        err,
        '사용자 데이터 검색 중 에러가 발생했습니다.',
      );
    }
  }

  async findMentorByIntraId(intraId: string): Promise<Mentors> {
    let mentor: Mentors;
    try {
      mentor = await this.mentorsRepository.findOneBy({
        intraId: intraId,
      });
    } catch {
      throw new ConflictException(
        '해당 아이디의 멘토 찾는중 오류가 발생하였습니다',
      );
    }
    if (!mentor) {
      throw new NotFoundException(`해당 멘토를 찾을 수 없습니다`);
    }
    return mentor;
  }

  async findMentoringLogsByMentorIntraId(
    intraId: string,
  ): Promise<MentoringLogs[]> {
    let mentoringLogs: MentoringLogs[];
    try {
      mentoringLogs = await this.mentoringLogsRepository.find({
        where: {
          mentors: {
            intraId: intraId,
          },
        },
        select: {
          meetingAt: true,
          topic: true,
          status: true,
        },
      });
    } catch {
      throw new ConflictException(
        '해당 아이디의 멘토링 로그를 찾는중 오류가 발생하였습니다',
      );
    }
    if (!mentoringLogs) {
      throw new NotFoundException(`해당 멘토의 멘토링 로그를 찾을 수 없습니다`);
    }
    return mentoringLogs;
  }

  async findCommentByMentorIntraId(intraId: string): Promise<Comments[]> {
    let comments: Comments[];
    try {
      comments = await this.commentsRepository.find({
        where: {
          mentors: {
            intraId: intraId,
          },
          isDeleted: false,
        },
        relations: {
          cadets: true,
        },
        select: {
          content: true,
          createdAt: true,
          cadets: {
            intraId: true,
          },
        },
      });
    } catch {
      throw new ConflictException(
        '해당 아이디의 코멘트 찾는중 오류가 발생하였습니다',
      );
    }
    if (!comments) {
      throw new NotFoundException(`해당 멘토의 코멘트를 찾을 수 없습니다`);
    }
    return comments;
  }

  /*
   * @Get
   */
  async getMentorDetails(intraId: string): Promise<Mentors> {
    const mentor: Mentors = await this.findMentorByIntraId(intraId);
    mentor.comments = await this.findCommentByMentorIntraId(mentor.intraId);
    mentor.mentoringLogs = await this.findMentoringLogsByMentorIntraId(
      mentor.intraId,
    );
    return mentor;
  }

  /*
   * @Post
   */
  async updateMentorDetails(intraId: string, body: UpdateMentorDatailDto) {
    const mentor: Mentors = await this.findMentorByIntraId(intraId);
    mentor.availableTime = JSON.stringify(
      this.validateAvailableTime(body.availableTime),
    );
    mentor.introduction = body.introduction;
    mentor.isActive = body.isActive;
    mentor.markdownContent = body.markdownContent;
    try {
      await this.mentorsRepository.save(mentor);
      return 'ok';
    } catch {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }

  async validateInfo(intraId: string): Promise<boolean> {
    try {
      const mentor: Mentors = await this.findMentorByIntraId(intraId);
      if (mentor.name === null) {
        return false;
      }
      const week: availableTimeDto[][] = JSON.parse(mentor.availableTime);
      week.forEach(day => {
        if (day.length > 0) {
          return true;
        }
      });
      return false;
    } catch (err) {
      throw new ConflictException(err, '예기치 못한 에러가 발생하였습니다');
    }
  }

  async saveInfos(
    user: jwtUser,
    name: string,
    availableTime: availableTimeDto[][],
  ): Promise<void> {
    if (name === '') {
      throw new BadRequestException('입력된 이름이 없습니다.');
    }
    try {
      const foundUser: Mentors = await this.findMentorByIntraId(user.intraId);
      foundUser.name = name;
      foundUser.availableTime = JSON.stringify(
        this.validateAvailableTime(availableTime),
      );
      foundUser.isActive = true;
      await this.mentorsRepository.save(foundUser);
    } catch (err) {
      throw new ConflictException(err, '예기치 못한 에러가 발생하였습니다');
    }
  }

  isValidTime(time: availableTimeDto): boolean {
    if (
      !(time.start_hour >= 0 && time.start_hour < 24) ||
      !(time.start_minute === 0 || time.start_minute === 30) ||
      !(time.end_hour >= 0 && time.end_hour < 24) ||
      !(time.end_minute === 0 || time.end_minute === 30)
    ) {
      return false;
    }
    if (time.start_hour >= time.end_hour) {
      return false;
    }
    if (
      time.end_hour -
        time.start_hour * 60 +
        (time.end_minute - time.start_minute) <
      60
    ) {
      return false;
    }
    return true;
  }

  validateAvailableTime(time: availableTimeDto[][]): availableTimeDto[][] {
    time.forEach(t =>
      t.forEach(tt => {
        if (!this.isValidTime(tt)) {
          throw new BadRequestException('올바르지 않은 시간 형식입니다');
        }
      }),
    );
    return time;
  }
}
