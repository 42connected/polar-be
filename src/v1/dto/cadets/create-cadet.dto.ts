import { IsBoolean, IsString } from 'class-validator';

export class CreateCadetDto {
  @IsString()
  intraId: string;

  @IsString()
  profileImage: string;

  @IsBoolean()
  isCommon: boolean;
}
