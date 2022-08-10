import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';
import { CreateCommentDto, UpdateCommentDto } from '../dto/comment/comment.dto';
import { jwtUser } from '../interface/jwt-user.interface';
import { JwtGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/role.guard';
import { CommentsService } from './service/comments.service';

@Controller()
export class CommentsController {
  constructor(private readonly commentService: CommentsService) {}

  @Post(':mentorIntraId')
  @Roles('cadet')
  @UseGuards(JwtGuard, RolesGuard)
  async postComment(
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
  async updateComment(
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
  async deleteComment(
    @User() user: jwtUser,
    @Param('commentId') commentId: string,
  ) {
    return this.commentService.deleteComment(user.intraId, commentId);
  }
}
