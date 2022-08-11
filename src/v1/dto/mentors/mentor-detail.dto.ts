import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AvailableTimeDto } from '../available-time.dto';

export class UpdateMentorDatailDto {
  @IsNotEmpty()
  availableTime: AvailableTimeDto[][];

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
