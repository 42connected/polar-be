import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class GetCommentDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  take: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  page: number;
}

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
