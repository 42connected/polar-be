import { IsString } from 'class-validator';

export class ReportIdDto {
  @IsString({ each: true })
  id: string[];
}
