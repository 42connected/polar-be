import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { availableTimeDto } from '../available-time.dto';

export class UpdateMentorDatailDto {
  @IsNotEmpty()
  availableTime: availableTimeDto[][];

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
