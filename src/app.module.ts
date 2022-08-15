import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmConfigService } from './v1/config/typeorm.config';
import { V1Module } from './v1/v1.module';
import { APP_GUARD, RouterModule } from '@nestjs/core';
import { MentorsModule } from './v1/mentors/mentors.module';
import { ReportsModule } from './v1/reports/reports.module';
import { CategoriesModule } from './v1/categories/categories.module';
import { CadetsModule } from './v1/cadets/cadets.module';
import { BocalsModule } from './v1/bocals/bocals.module';
import { CommentsModule } from './v1/comments/comments.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullQueueModule } from './bull-queue/bull-queue.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { BatchModule } from './v1/batch/batch.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CalendarModule } from './v1/calendar/calendar.module';
import { EmailTestModule } from './v1/email-test/email-test.module';
import { MentoringLogsModule } from './v1/mentoring-logs/mentoring-logs.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: parseInt(process.env.EMAIL_PORT, 10),
          auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
          },
        },
        template: {
          dir: './templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRE },
        };
      },
    }),
    BullQueueModule,
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
            path: 'categories',
            module: CategoriesModule,
          },
          {
            path: 'reports',
            module: ReportsModule,
          },
          {
            path: 'comments',
            module: CommentsModule,
          },
          {
            path: 'batch',
            module: BatchModule,
          },
          {
            path: 'calendar',
            module: CalendarModule,
          },
          {
            path: 'email-test',
            module: EmailTestModule,
          },
          {
            path: 'mentoring-logs',
            module: MentoringLogsModule,
          },
        ],
      },
    ]),
    ThrottlerModule.forRoot({
      ttl: 30,
      limit: 5,
    }),
    EmailTestModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
