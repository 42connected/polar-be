import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Keywords } from '../entities/keywords.entity';
import { SlackService } from '../slack/service/slack.service';
import { KeywordsController } from './keywords.controller';
import { KeywordsService } from './service/keywords.service';

@Module({
  imports: [TypeOrmModule.forFeature([Keywords]), AuthModule],
  controllers: [KeywordsController],
  providers: [KeywordsService, SlackService],
})
export class KeywordsModule {}
