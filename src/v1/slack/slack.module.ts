import { Module } from '@nestjs/common';
import { SlackService } from './service/slack.service';

@Module({
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
