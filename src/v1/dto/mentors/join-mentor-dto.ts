import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AvailableTimeDto } from '../available-time.dto';

export class JoinMentorDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'name',
    required: true,
    type: String,
    example: '김나경',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'slackId',
    required: true,
    type: String,
    example: 'nakkim',
  })
  slackId: string;

  @IsOptional()
  @Type(() => AvailableTimeDto)
  @Transform(data => JSON.parse(JSON.stringify(data.value)))
  @ApiPropertyOptional({
    description: 'availableTime',
    required: true,
    type: [[AvailableTimeDto]],
    example: [
      [],
      [
        { startHour: 6, startMinute: 0, endHour: 10, endMinute: 0 },
        { startHour: 10, startMinute: 0, endHour: 11, endMinute: 0 },
      ],
      [],
      [],
      [{ startHour: 6, startMinute: 30, endHour: 9, endMinute: 0 }],
      [],
      [{ startHour: 6, startMinute: 30, endHour: 9, endMinute: 0 }],
    ],
  })
  availableTime?: AvailableTimeDto[][];

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({
    description: 'isActive',
    required: false,
    type: Boolean,
  })
  isActive: boolean;
}
