import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateMentoringDto {
  @IsUUID()
  id: string;

  @IsString()
  @ApiProperty({
    description: 'status',
    required: true,
  })
  status: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'rejectMessage',
    required: false,
  })
  rejectMessage: string;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  @ApiPropertyOptional({
    description: ' meetingAt',
    required: false,
    type: Date,
  })
  meetingAt: Date;
}
