import { AvailableTimeDto } from 'src/v1/dto/available-time.dto';

export interface UpdateMentor {
  availableTime?: AvailableTimeDto[][];
  introduction?: string;
  isActive?: boolean;
  markdownContent?: string;
  name?: string;
  tags?: string[];
  slackId?: string;
}
