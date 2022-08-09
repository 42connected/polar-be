import { Controller, Get, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BocalsService } from '../bocals/service/bocals.service';
import { CadetsService } from '../cadets/service/cadets.service';
import { CreateBocalDto } from '../dto/bocals/create-bocal.dto';
import { CreateCadetDto } from '../dto/cadets/create-cadet.dto';
import { CreateMentorDto } from '../dto/mentors/create-mentor.dto';
import { jwtUser } from '../interface/jwt-user.interface';
import { MentorsService } from '../mentors/service/mentors.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private mentorsService: MentorsService,
    private cadetsService: CadetsService,
    private bocalsService: BocalsService,
  ) {}

  @Get('/oauth/callback')
  async getProfile(@Query('code') code: string) {
    const accessToken = await this.authService.getAccessToken(code);
    const profile = await this.authService.getProfile(accessToken);
    const {
      login: intraId,
      image_url: profileImage,
      alumnized_at: isCommon,
    } = profile;
    let result: jwtUser;
    if (intraId.startsWith('m-')) {
      result = await this.mentorsService.findByIntra(intraId);
      if (result.id === undefined) {
        const user: CreateMentorDto = {
          intraId,
          profileImage,
        };
        result = await this.mentorsService.createUser(user);
      }
    } else if (profile['staff?']) {
      result = await this.bocalsService.findByIntra(intraId);
      if (result.id === undefined) {
        const user: CreateBocalDto = {
          intraId,
        };
        result = await this.bocalsService.createUser(user);
      }
    } else {
      result = await this.cadetsService.findByIntra(intraId);
      if (result.id === undefined) {
        const user: CreateCadetDto = {
          intraId,
          profileImage,
          isCommon: isCommon === null ? true : false,
        };
        result = await this.cadetsService.createUser(user);
      }
    }
    return this.jwtService.sign({
      sub: result.id,
      username: result.intraId,
      role: result.role,
    });
  }
}
