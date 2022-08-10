import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import { ValidateInfoMiddleware } from 'src/v1/middlewares/validate-info.middleware';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    KeywordsModule,
    MentorsModule,
    ReportsModule,
    CadetsModule,
    BocalsModule,
    AuthModule,
    CommentsModule,
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRE },
        };
      },
    }),
  ],
  controllers: [V1Controller],
  providers: [V1Service, FortyTwoStrategy, JwtStrategy],
})
export class V1Module {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidateInfoMiddleware)
      .exclude(
        { path: 'api/v1/cadets/join', method: RequestMethod.ALL },
        { path: 'api/v1/mentors/join', method: RequestMethod.ALL },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
