import { IsNotEmpty, IsString } from 'class-validator';

export class CreateApplyDto {
  @IsString()
  topic: string;

  @IsString()
  content: string;

  requestTime1: Date[];
  requestTime2: Date[];
  requestTime3: Date[];
}
