import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class ApproveMentoringDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'mentoring logs uuid',
    required: true,
    type: String,
  })
  mentoringLogId: string;
}
