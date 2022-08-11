import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}

export class UpdateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
