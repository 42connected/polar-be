import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateCommentDto,
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

  async findCadetByIntraId(intraId: string) {
    try {
      const cadet: Cadets = await this.cadetsRepository.findOneBy({
        intraId: intraId,
      });
      if (!cadet) {
        throw new NotFoundException(`해당 카뎃을 찾을 수 없습니다`);
      }
      return cadet;
    } catch {
      throw new ConflictException(
        '해당 아이디의 카뎃 찾는중 오류가 발생하였습니다',
      );
    }
  }

  async findCommentNotDeletedById(commentId: string): Promise<Comments> {
    try {
      const comment: Comments = await this.commentsRepository.findOne({
        where: { id: commentId, isDeleted: false },
        relations: { mentors: true, cadets: true },
        select: { mentors: { intraId: true }, cadets: { intraId: true } },
      });
      if (!comment) {
        throw new NotFoundException(`해당 코멘트를 찾을 수 없습니다`);
      }
      return comment;
    } catch {
      throw new ConflictException(
        '해당 아이디의 코멘트를 찾는중 오류가 발생하였습니다',
      );
    }
  }

  /*
   * @Get
   */
  async getComment(commentId: string) {
    return await this.findCommentNotDeletedById(commentId);
  }

  /*
   * @Post
   */
  async createComment(
    cadetIntraId: string,
    mentorIntaId: string,
    createCommentDto: CreateCommentDto,
  ) {
    const cadet = await this.findCadetByIntraId(cadetIntraId);
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
   * @Patch
   */
  async updateComment(
    cadetIntraId: string,
    commentId: string,
    updateCommentDto: UpdateCommentDto,
  ) {
    const cadet = await this.findCadetByIntraId(cadetIntraId);
    const comment = await this.findCommentNotDeletedById(commentId);
    if (cadet.id !== comment.cadets.id) {
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
  async deleteComment(cadetIntraId: string, commentId: string) {
    const cadet = await this.findCadetByIntraId(cadetIntraId);
    const comment = await this.findCommentNotDeletedById(commentId);
    if (cadet.id !== comment.cadets?.id) {
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
