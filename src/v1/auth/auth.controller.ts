import {
  Controller,
  ForbiddenException,
  Get,
  Query,
  Res,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BocalsService } from '../bocals/service/bocals.service';
import { CadetsService } from '../cadets/service/cadets.service';
import { AuthResponse } from '../dto/auth-response.dto';
import { CreateBocalDto } from '../dto/bocals/create-bocals.dto';
import { CreateCadetDto } from '../dto/cadets/create-cadet.dto';
import { CreateMentorDto } from '../dto/mentors/create-mentor.dto';
import { Bocals } from '../entities/bocals.entity';
import { Cadets } from '../entities/cadets.entity';
import { Mentors } from '../entities/mentors.entity';
import { JwtUser } from '../interface/jwt-user.interface';
import { MentorsService } from '../mentors/service/mentors.service';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('auth API')
export class AuthController {
  constructor(
    private jwtService: JwtService,
    private authService: AuthService,
    private mentorsService: MentorsService,
    private cadetsService: CadetsService,
    private bocalsService: BocalsService,
  ) {}

  @Get('/oauth/callback')
  @ApiOperation({
    summary: '42 OAuth callbaack',
    description:
      'access token을 이용하여 사용자 프로필 정보를 가져와서 로그인 처리',
  })
  async getProfile(
    @Query('code') code: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<boolean> {
    const accessToken = await this.authService.getAccessToken(code);
    const profile = await this.authService.getProfile(accessToken);
    const {
      login: intraId,
      image_url: profileImage,
      alumnized_at: isCommon,
      cursus_users: cursus,
      email,
    } = profile;
    let result: JwtUser;
    let join: boolean;
    if (profile.campus[0].name !== 'Seoul') {
      throw new ForbiddenException('서울 캠퍼스만 가입이 가능합니다.');
    }
    if (intraId.startsWith('m-')) {
      const mentor: Mentors = await this.mentorsService.findByIntra(intraId);
      const newData: CreateMentorDto = { intraId, profileImage };
      if (!mentor) {
        result = await this.mentorsService.createUser(newData);
        join = false;
      } else {
        result = await this.mentorsService.updateLogin(mentor, newData);
        join = this.mentorsService.validateInfo(mentor);
      }
    } else if (profile['staff?']) {
      join = true;
      const bocal: Bocals = await this.bocalsService.findByIntra(intraId);
      const newData: CreateBocalDto = { intraId };
      if (!bocal) {
        result = await this.bocalsService.createUser(newData);
      } else {
        result = await this.bocalsService.updateLogin(bocal, newData);
      }
    } else {
      const cadet: Cadets = await this.cadetsService.findByIntra(intraId);
      if (cursus.length < 2) {
        throw new ForbiddenException('본과정 카뎃만 가입이 가능합니다.');
      }
      const newData: CreateCadetDto = {
        intraId,
        profileImage,
        isCommon: isCommon === null ? true : false,
        email,
      };
      if (!cadet) {
        result = await this.cadetsService.createUser(newData);
        join = false;
      } else {
        result = await this.cadetsService.updateLogin(cadet, newData);
        join = this.cadetsService.validateInfo(cadet);
      }
    }
    const jwt = await this.jwtService.sign({
      sub: result.id,
      username: result.intraId,
      role: result.role,
    });
    res.cookie;
    const cookieInfos: AuthResponse = {
      jwt,
      user: { intraId: result.intraId, role: result.role, join },
    };
    this.authService.setCookies(res, cookieInfos);
    return true;
  }
}
