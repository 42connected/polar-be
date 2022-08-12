import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AvailableTimeDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'start_hour',
    required: true,
    type: Number,
  })
  start_hour: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'start_minute',
    required: true,
    type: Number,
  })
  start_minute: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'end_hour',
    required: true,
    type: Number,
  })
  end_hour: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'end_minute',
    required: true,
    type: Number,
  })
  end_minute: number;
}
