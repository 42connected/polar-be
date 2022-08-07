import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';

@Module({
  providers: [SlackService],
})
export class SlackModule {}
