import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AvailableTimeDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'start hour',
    required: true,
    type: Number,
  })
  startHour: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'start minute',
    required: true,
    type: Number,
  })
  startMinute: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'end hour',
    required: true,
    type: Number,
  })
  endHour: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'end minute',
    required: true,
    type: Number,
  })
  endMinute: number;
}
