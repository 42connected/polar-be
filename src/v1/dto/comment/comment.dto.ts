import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'content', required: true })
  content: string;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'content', required: true })
  content: string;
}
