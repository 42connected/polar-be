import { Controller, Get, Query, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { BocalsService } from '../bocals/service/bocals.service';
import { CadetsService } from '../cadets/service/cadets.service';
import { CreateBocalDto } from '../dto/bocals/create-bocals.dto';
import { CreateCadetDto } from '../dto/cadets/create-cadet.dto';
import { CreateMentorDto } from '../dto/mentors/create-mentor.dto';
import { LoginResponse } from '../interface/auth-response.interface';
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
    summary: 'getProfile API',
    description: 'oauth 프로파일 정보 가져오기',
  })
  @ApiCreatedResponse({
    description: 'oauth 프로파일 정보 수정 성공',
    type: String,
  })
  async getProfile(@Query('code') code: string): Promise<LoginResponse> {
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
      if (cursus.length < 2) {
        throw new UnauthorizedException('본과정 카뎃만 가입이 가능합니다.');
      }
      if (result.id === undefined) {
        const user: CreateCadetDto = {
          intraId,
          profileImage,
          isCommon: isCommon === null ? true : false,
          email,
        };
        result = await this.cadetsService.createUser(user);
      }
    }
    const jwt = await this.jwtService.sign({
      sub: result.id,
      username: result.intraId,
      role: result.role,
    });
    return { jwt, user: { intraId: result.intraId, role: result.role } };
  }
}
