import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateCommentDto,
  GetCommentDto,
  UpdateCommentDto,
} from 'src/v1/dto/comment/comment.dto';
import { Cadets } from 'src/v1/entities/cadets.entity';
import { Comments } from 'src/v1/entities/comments.entity';
import { Mentors } from 'src/v1/entities/mentors.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
    @InjectRepository(Mentors)
    private mentorsRepository: Repository<Mentors>,
    @InjectRepository(Cadets)
    private cadetsRepository: Repository<Cadets>,
  ) {}

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

  async findCadetByIntraId(intraId: string): Promise<Cadets> {
    let cadet: Cadets;
    try {
      cadet = await this.cadetsRepository.findOneBy({
        intraId: intraId,
      });
    } catch {
      throw new ConflictException(
        '해당 아이디의 카뎃 찾는중 오류가 발생하였습니다',
      );
    }
    if (!cadet) {
      throw new NotFoundException(`해당 카뎃을 찾을 수 없습니다`);
    }
    return cadet;
  }

  async findCommentById(commentId: string): Promise<Comments> {
    let comment: Comments;
    try {
      comment = await this.commentsRepository.findOne({
        where: { id: commentId },
        relations: { cadets: true },
        select: { cadets: { intraId: true } },
      });
    } catch {
      throw new ConflictException(
        '해당 아이디의 코멘트를 찾는중 오류가 발생하였습니다',
      );
    }
    if (!comment) {
      throw new NotFoundException(`해당 코멘트를 찾을 수 없습니다`);
    }
    return comment;
  }

  /*
   * @Post
   */
  async createComment(
    intraId: string,
    mentorIntaId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const cadet = await this.findCadetByIntraId(intraId);
    const mentor = await this.findMentorByIntraId(mentorIntaId);
    const comment = this.commentsRepository.create({
      cadets: cadet,
      mentors: mentor,
      content: createCommentDto.content,
    });
    try {
      await this.commentsRepository.save(comment);
      return 'ok';
    } catch {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }

  /*
   * @Get
   */
  async getCommentPagination(intraId: string, getCommentDto: GetCommentDto) {
    try {
      const comment = await this.commentsRepository.findAndCount({
        where: {
          isDeleted: false,
          mentors: { intraId: intraId },
        },
        take: getCommentDto.take,
        skip: getCommentDto.take * (getCommentDto.page - 1),
        order: { createdAt: 'DESC' },
      });
      return comment;
    } catch {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }

  /*
   * @Patch
   */
  async updateComment(
    intraId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const comment = await this.findCommentById(commentId);
    if (intraId !== comment.cadets?.intraId) {
      throw new UnauthorizedException(
        `해당 코멘트를 수정할 수 있는 권한이 없습니다`,
      );
    }
    comment.content = updateCommentDto.content;
    try {
      await this.commentsRepository.save(comment);
      return 'ok';
    } catch {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }

  /*
   * @Delete
   */
  async deleteComment(intraId: string, commentId: string) {
    const comment = await this.findCommentById(commentId);
    if (intraId !== comment.cadets?.intraId) {
      throw new UnauthorizedException(
        `해당 코멘트를 삭제할 수 있는 권한이 없습니다`,
      );
    }
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    try {
      await this.commentsRepository.save(comment);
      return 'ok';
    } catch {
      throw new ConflictException('예기치 못한 에러가 발생하였습니다');
    }
  }
}
