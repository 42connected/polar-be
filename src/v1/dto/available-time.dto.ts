import { IsNotEmpty, IsNumber } from 'class-validator';

export class AvailableTimeDto {
  @IsNumber()
  @IsNotEmpty()
  start_hour: number;

  @IsNumber()
  @IsNotEmpty()
  start_minute: number;

  @IsNumber()
  @IsNotEmpty()
  end_hour: number;

  @IsNumber()
  @IsNotEmpty()
  end_minute: number;
}
