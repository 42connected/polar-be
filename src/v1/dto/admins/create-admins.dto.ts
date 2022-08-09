import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminsDto {
  @IsString()
  @IsNotEmpty()
  intraId: string;
}
