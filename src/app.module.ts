import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CadetsService } from './cadets/cadets.service';
import { MentorsService } from './mentors/mentors.service';
import { FortyTwoStrategy } from './strategies/forty-two.strategy';
import { AuthController } from './auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmConfigService } from './config/typeorm.config';

@Module({
  imports: [
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
          signOptions: { expiresIn: '1m' },
        };
      },
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, CadetsService, MentorsService, FortyTwoStrategy],
})
export class AppModule {}
