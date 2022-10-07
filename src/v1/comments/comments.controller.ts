import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment/comment.dto';
import { JwtUser } from '../interface/jwt-user.interface';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { CommentsService } from './service/comments.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { CommentPaginationDto } from '../dto/comment/comment-pagination.dto';

@Controller()
@ApiTags('comments API')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get(':mentorIntraId')
  @ApiOperation({
    summary: 'comments API',
    description: '해당 멘토에 대한 댓글을 반환합니다.',
  })
  @ApiCreatedResponse({
    description: '댓글 배열과 전체 댓글 수',
    type: CommentPaginationDto,
  })
  async get(
    @Param('mentorIntraId') mentorIntraId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<CommentPaginationDto> {
    const result = await this.commentService.getCommentPagination(
      mentorIntraId,
      paginationDto,
    );
    return { comments: result[0], total: result[1] };
  }

  @Post(':mentorIntraId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Create comment',
    description: '멘토링 후기 생성하기',
  })
  async post(
    @User() user: JwtUser,
    @Param('mentorIntraId') mentorIntraId: string,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<boolean> {
    return this.commentService.createComment(
      user.intraId,
      mentorIntraId,
      createCommentDto,
    );
  }

  @Patch(':commentId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'comments update API',
    description: '멘토링 후기 수정하기',
  })
  @ApiCreatedResponse({
    description: '멘토링 후기 수정 성공',
    type: String,
  })
  async update(
    @User() user: JwtUser,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ): Promise<boolean> {
    return this.commentService.updateComment(
      user.intraId,
      commentId,
      updateCommentDto,
    );
  }

  @Delete(':commentId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Delete comment',
    description: '멘토링 후기 삭제하기',
  })
  async delete(
    @User() user: JwtUser,
    @Param('commentId') commentId: string,
  ): Promise<boolean> {
    return this.commentService.deleteComment(user.intraId, commentId);
  }
}
