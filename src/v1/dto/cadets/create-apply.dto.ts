import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateApplyDto {
  @IsString()
  @IsNotEmpty()
  topic: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @Type(() => Date)
  @IsNotEmpty()
  requestTime1: Date[];

  @IsOptional()
  @Type(() => Date)
  requestTime2: Date[];

  @IsOptional()
  @Type(() => Date)
  requestTime3: Date[];
}
