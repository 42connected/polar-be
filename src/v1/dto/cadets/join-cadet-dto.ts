import { IsNotEmpty, IsString } from 'class-validator';

export class JoinCadetDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
