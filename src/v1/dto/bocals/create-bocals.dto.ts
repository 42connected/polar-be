import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBocalsDto {
  @IsString()
  @IsNotEmpty()
  intraId: string;
}
