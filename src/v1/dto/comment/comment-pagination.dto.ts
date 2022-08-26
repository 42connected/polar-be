import { ApiProperty } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

export class CommentPaginationDto {
  @ApiProperty({
    type: CommentDto,
    isArray: true,
  })
  comments: CommentDto[];

  @ApiProperty({
    description: '댓글의 총 개수',
    type: Number,
  })
  total: number;
}
