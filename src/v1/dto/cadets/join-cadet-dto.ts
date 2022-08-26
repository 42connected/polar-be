import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinCadetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: '본명',
    required: true,
    example: '김나경',
  })
  name: string;
}
