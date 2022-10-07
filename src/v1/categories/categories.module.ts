import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { Categories } from '../entities/categories.entity';
import { KeywordCategories } from '../entities/keyword-categories.entity';
import { Keywords } from '../entities/keywords.entity';
import { MentorKeywords } from '../entities/mentor-keywords.entity';
import { MentoringLogs } from '../entities/mentoring-logs.entity';
import { Mentors } from '../entities/mentors.entity';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './service/categories.service';
import { KeywordsService } from './service/keywords.service';
import { SearchMentorsService } from './service/search-mentors.service';
import * as redisStore from 'cache-manager-redis-store';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          store: redisStore,
          host: configService.get('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
          ttl: 60 * 60,
        };
      },
    }),
    TypeOrmModule.forFeature([
      Categories,
      Mentors,
      MentorKeywords,
      MentoringLogs,
      KeywordCategories,
      Keywords,
    ]),
    AuthModule,
  ],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    SearchMentorsService,
    KeywordsService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class CategoriesModule {}
