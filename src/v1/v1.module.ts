import { Module } from '@nestjs/common';
import { V1Controller } from './v1.controller';
import { V1Service } from './v1.service';
import { KeywordsModule } from './keywords/keywords.module';
import { MentorsModule } from './mentors/mentors.module';
import { ReportsModule } from './reports/reports.module';
import { CadetsModule } from './cadets/cadets.module';
import { BocalsModule } from './bocals/bocals.module';

@Module({
  controllers: [V1Controller],
  providers: [V1Service],
  imports: [KeywordsModule, MentorsModule, ReportsModule, CadetsModule, BocalsModule]
})
export class V1Module {}
