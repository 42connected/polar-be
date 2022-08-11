import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBocalDto {
  @IsString()
  @IsNotEmpty()
  intraId: string;
}
