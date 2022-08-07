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
    try {
      const mentor: Mentors = await this.mentorsRepository.findOneBy({
        intraId: intraId,
      });
      if (!mentor) {
        throw new NotFoundException(`해당 멘토를 찾을 수 없습니다`);
      }
      return mentor;
    } catch {
      throw new ConflictException(
        '해당 아이디의 멘토 찾는중 오류가 발생하였습니다',
      );
    }
  }

  async findMentorDetailsByIntraId(intraId: string) {
    try {
      const mentorDetail: Mentors = await this.mentorsRepository.findOne({
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
      if (!mentorDetail) {
        throw new NotFoundException(`해당 멘토를 찾을 수 없습니다`);
      }
      return mentorDetail;
    } catch {
      throw new ConflictException(
        '해당 아이디의 멘토 찾는중 오류가 발생하였습니다',
      );
    }
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
    mentor.availableTime = body.availableTime;
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
      if (mentor.name === null || mentor.availableTime === null) {
        return false;
      }
      return true;
    } catch (err) {
      throw new ConflictException(err, '예기치 못한 에러가 발생하였습니다');
    }
  }

  async saveName(user: jwtUser, name: string): Promise<void> {
    try {
      if (name === '') {
        throw new BadRequestException('입력된 이름이 없습니다.');
      }
      const foundUser = await this.findMentorByIntraId(user.intraId);
      foundUser.name = name;
      await this.mentorsRepository.save(foundUser);
    } catch (err) {
      throw new ConflictException(err, '예기치 못한 에러가 발생하였습니다');
    }
  }
}
