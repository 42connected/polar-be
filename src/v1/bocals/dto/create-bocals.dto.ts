import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBocalDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'intraId', required: true })
  intraId: string;
}
