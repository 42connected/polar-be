import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CancelMessageDto {
  @IsEmail()
  @ApiProperty({
    description: 'mentorEmail',
    required: true,
  })
  mentorEmail: string;

  @IsString()
  @Length(0, 15)
  @ApiProperty({
    description: 'mentorSlackId',
    required: true,
  })
  mentorSlackId: string;

  @IsEmail()
  @ApiProperty({
    description: 'cadetEmail',
    required: true,
  })
  cadetEmail: string;

  @IsString()
  @Length(0, 15)
  @ApiProperty({
    description: 'cadetSlackId',
    required: true,
  })
  cadetSlackId: string;

  @IsString()
  @IsOptional()
  rejectMessage: string;
}
