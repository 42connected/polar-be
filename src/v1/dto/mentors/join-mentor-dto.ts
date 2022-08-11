import { IsNotEmpty, IsString } from 'class-validator';
import { AvailableTimeDto } from '../available-time.dto';

export class JoinMentorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  availableTime: AvailableTimeDto[][];
}
