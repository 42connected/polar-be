import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from './config/typeorm.config';
import { V1Module } from './v1/v1.module';
import { RouterModule } from '@nestjs/core';
import { MentorsModule } from './v1/mentors/mentors.module';
import { ReportsModule } from './v1/reports/reports.module';
import { KeywordsModule } from './v1/keywords/keywords.module';
import { CadetsModule } from './v1/cadets/cadets.module';
import { BocalsModule } from './v1/bocals/bocals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    V1Module,
    RouterModule.register([
      {
        path: 'api/v1',
        module: V1Module,
        children: [
          {
            path: 'cadets',
            module: CadetsModule,
          },
          {
            path: 'mentors',
            module: MentorsModule,
          },
          {
            path: 'bocals',
            module: BocalsModule,
          },
          {
            path: 'keywords',
            module: KeywordsModule,
          },
          {
            path: 'reports',
            module: ReportsModule,
          },
        ],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
