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

@Injectable()
export class MentorsService {
  constructor(
    @InjectRepository(Mentors) private mentorsRepository: Repository<Mentors>,
  ) {}

  async createUser(user: CreateMentorDto): Promise<jwtUser> {
    try {
      const createdUser: Mentors = this.mentorsRepository.create(user);
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

  async findMentorByIntraId(intraId: string) {
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

  async findMentorDetailsByIntraId(intraId: string) {
    let mentorDetail: Mentors;
    try {
      mentorDetail = await this.mentorsRepository.findOne({
        where: {
          intraId: intraId,
          comments: {
            isDeleted: false,
          },
        },
        relations: {
          mentoringLogs: true,
          comments: { cadets: true },
        },
      });
    } catch {
      throw new ConflictException(
        '해당 아이디의 멘토 찾는중 오류가 발생하였습니다',
      );
    }
    if (!mentorDetail) {
      throw new NotFoundException(`해당 멘토를 찾을 수 없습니다`);
    }
    return mentorDetail;
  }

  /*
   * @Get
   */
  async getMentorDetails(intraId: string): Promise<Mentors> {
    const mentorDetail: Mentors = await this.findMentorDetailsByIntraId(
      intraId,
    );
    return mentorDetail;
  }

  /*
   * @Post
   */
  async updateMentorDetails(intraId: string, body: UpdateMentorDatailDto) {
    const mentor: Mentors = await this.findMentorByIntraId(intraId);
    mentor.availableTime = JSON.stringify(body.availableTime);
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
      foundUser.availableTime = JSON.stringify(availableTime);
      await this.mentorsRepository.save(foundUser);
    } catch (err) {
      throw new ConflictException(err, '예기치 못한 에러가 발생하였습니다');
    }
  }
}
