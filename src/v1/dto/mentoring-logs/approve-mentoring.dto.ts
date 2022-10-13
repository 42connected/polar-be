import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Max, Min } from 'class-validator';

export class ApproveMentoringDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'mentoring logs uuid',
    required: true,
    type: String,
  })
  mentoringLogId: string;

  @IsNumber()
  @Min(0)
  @Max(2)
  @ApiPropertyOptional({
    description: 'meetingAt',
    required: true,
  })
  meetingAtIndex: number;
}
