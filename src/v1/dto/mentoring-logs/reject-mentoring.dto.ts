import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class RejectMentoringDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty({
    description: 'mentoring logs uuid',
    required: true,
    type: String,
  })
  mentoringLogId: string;

  @IsString()
  @ApiProperty({
    description: 'reject message',
    required: true,
    type: String,
  })
  rejectMessage: string;
}
