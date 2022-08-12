import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class JoinCadetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name',
    required: true,
  })
  name: string;
}
