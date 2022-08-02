import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CadetsService } from './cadets/cadets.service';
import { MentorsService } from './mentors/mentors.service';
import { FortyTwoStrategy } from './strategies/forty-two.strategy';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, AuthController],
  providers: [AppService, CadetsService, MentorsService, FortyTwoStrategy],
})
export class AppModule {}
