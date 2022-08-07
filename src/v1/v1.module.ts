import { Module } from '@nestjs/common';
import { V1Controller } from './v1.controller';
import { V1Service } from './v1.service';
import { KeywordsModule } from './keywords/keywords.module';
import { MentorsModule } from './mentors/mentors.module';
import { ReportsModule } from './reports/reports.module';
import { CadetsModule } from './cadets/cadets.module';
import { BocalsModule } from './bocals/bocals.module';
import { FortyTwoStrategy } from './strategies/forty-two.strategy';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CommentsModule } from './comments/comments.module';
import { SlackModule } from './slack/slack.module';

@Module({
  imports: [
    KeywordsModule,
    MentorsModule,
    ReportsModule,
    CadetsModule,
    BocalsModule,
    AuthModule,
    CommentsModule,
    SlackModule,
  ],
  controllers: [V1Controller],
  providers: [V1Service, FortyTwoStrategy, JwtStrategy],
})
export class V1Module {}
