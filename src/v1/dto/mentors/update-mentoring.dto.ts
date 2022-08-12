import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateMentoringDto {
  @IsUUID()
  id: string;

  @IsString()
  status: string;

  @IsString()
  @IsOptional()
  rejectMessage: string;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => Date)
  meetingAt: Date[];
}
