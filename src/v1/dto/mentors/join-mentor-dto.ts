import { IsNotEmpty, IsNotEmptyObject, IsString } from 'class-validator';
import { availableTimeDto } from '../available-time.dto';

export class JoinMentorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmptyObject()
  availableTime: availableTimeDto[][2];
}
