import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AvailableTimeDto {
  @IsNumber()
  @Transform(value => Number(value))
  @IsNotEmpty()
  @ApiProperty({
    description: 'start hour',
    required: true,
    type: Number,
  })
  startHour: number;

  @IsNumber()
  @Transform(value => Number(value))
  @IsNotEmpty()
  @ApiProperty({
    description: 'start minute',
    required: true,
    type: Number,
  })
  startMinute: number;

  @IsNumber()
  @Transform(value => Number(value))
  @IsNotEmpty()
  @ApiProperty({
    description: 'end hour',
    required: true,
    type: Number,
  })
  endHour: number;

  @IsNumber()
  @Transform(value => Number(value))
  @IsNotEmpty()
  @ApiProperty({
    description: 'end minute',
    required: true,
    type: Number,
  })
  endMinute: number;
}
