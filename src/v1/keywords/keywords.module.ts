import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Keywords } from '../entities/keywords.entity';
import { SlackModule } from '../slack/slack.module';
import { SlackService } from '../slack/slack.service';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './service/keywords.service';

@Module({
	// SlackModule도 지워야함! slack api 테스트용
  imports: [TypeOrmModule.forFeature([Keywords]), AuthModule, SlackModule],
  controllers: [KeywordsController],
  providers: [KeywordsService, SlackService],
})
export class KeywordsModule {}
