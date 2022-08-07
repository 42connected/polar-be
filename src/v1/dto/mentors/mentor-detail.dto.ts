import {
  IsBoolean,
  IsNotEmptyObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { availableTimeDto } from '../available-time.dto';

export class UpdateMentorDatailDto {
  @IsNotEmptyObject()
  availableTime: availableTimeDto[][2];

  @IsString()
  @IsOptional()
  introduction: string;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsString()
  @IsOptional()
  markdownContent: string;
}
