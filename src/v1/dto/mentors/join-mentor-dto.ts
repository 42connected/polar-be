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
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'email',
    required: true,
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'slackId',
    required: true,
    type: String,
  })
  slackId: string;

  @IsOptional()
  @Type(() => AvailableTimeDto)
  @Transform(data => JSON.parse(JSON.stringify(data.value)))
  @ApiPropertyOptional({
    description: 'availableTime',
    required: true,
    type: [[AvailableTimeDto]],
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
