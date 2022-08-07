import { IsNotEmpty, IsString } from 'class-validator';
import { availableTimeDto } from '../available-time.dto';

export class JoinMentorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  availableTime: availableTimeDto[][];
}
