import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMentorDto {
  @IsString()
  @IsNotEmpty()
  intraId: string;

  @IsString()
  profileImage: string;
}
