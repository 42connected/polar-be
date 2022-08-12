import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateCadetDto {
  @IsString()
  @IsNotEmpty()
  intraId: string;

  @IsString()
  profileImage: string;

  @IsBoolean()
  @IsNotEmpty()
  isCommon: boolean;

  @IsString()
  @IsNotEmpty()
  email: string;
}
