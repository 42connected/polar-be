import { IsString } from 'class-validator';

export class CreateMentorDto {
  @IsString()
  intraId: string;

  @IsString()
  profileImage: string;
}
