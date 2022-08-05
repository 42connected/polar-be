import { IsBoolean, IsDate, IsOptional, IsString } from 'class-validator';

export class UpdateMentorDatailDto {
  @IsDate()
  @IsOptional()
  availableTime: Date[][2];

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
