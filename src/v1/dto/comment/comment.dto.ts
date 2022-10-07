import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '댓글 내용', required: true })
  content: string;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: '댓글 내용', required: true })
  content: string;
}

export class CommentDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: '댓글 내용',
    example: '짱~',
  })
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({
    example: {
      intraId: 'nakkim',
      profileImage: 'https://asdf',
    },
  })
  cadets: {
    intraId: string;
    profileImage: string;
  };
}
