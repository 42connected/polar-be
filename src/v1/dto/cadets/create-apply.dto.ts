import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplyDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'topic', required: true, type: String })
  topic: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'content', required: true, type: String })
  content: string;

  @Type(() => Date)
  @IsNotEmpty()
  @ApiProperty({
    description: 'requestTime1',
    required: true,
    type: [Date],
  })
  requestTime1: Date[];

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'requestTime2',
    required: false,
    type: [Date],
  })
  requestTime2: Date[];

  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional({
    description: 'requestTime3',
    required: false,
    type: [Date],
  })
  requestTime3: Date[];
}
