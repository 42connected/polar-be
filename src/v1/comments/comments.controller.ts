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
import { jwtUser } from '../interface/jwt-user.interface';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { CommentsService } from './service/comments.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationDto } from '../dto/pagination.dto';
import { Comments } from '../entities/comments.entity';

@Controller()
@ApiTags('comments API')
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Get(':mentorIntraId')
  @UseGuards(JwtGuard, RolesGuard)
  async get(
    @Param('mentorIntraId') mentorIntraId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<[Comments[], number]> {
    return await this.commentService.getCommentPagination(
      mentorIntraId,
      paginationDto,
    );
  }

  @Post(':mentorIntraId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({
    summary: 'comments API',
    description: '멘토링 후기 생성하기',
  })
  @ApiCreatedResponse({
    description: '멘토링 후기 생성 성공',
    type: String,
  })
  async post(
    @User() user: jwtUser,
    @Param('mentorIntraId') mentorIntraId: string,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.createComment(
      user.intraId,
      mentorIntraId,
      createCommentDto,
    );
  }

  @Patch(':commentId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({
    summary: 'comments update API',
    description: '멘토링 후기 수정하기',
  })
  @ApiCreatedResponse({
    description: '멘토링 후기 수정 성공',
    type: String,
  })
  async update(
    @User() user: jwtUser,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(
      user.intraId,
      commentId,
      updateCommentDto,
    );
  }

  @Delete(':commentId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  @ApiOperation({
    summary: 'comments delete API',
    description: '멘토링 후기 삭제하기',
  })
  @ApiCreatedResponse({
    description: '멘토링 후기 삭제 성공',
    type: String,
  })
  async delete(@User() user: jwtUser, @Param('commentId') commentId: string) {
    return this.commentService.deleteComment(user.intraId, commentId);
  }
}
