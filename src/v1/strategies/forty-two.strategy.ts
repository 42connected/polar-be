import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { CreateMentorDto } from 'src/v1/dto/mentors/create-mentor.dto';
import { CreateCadetDto } from 'src/v1/dto/cadets/create-cadet.dto';
import { CadetsService } from '../cadets/service/cadets.service';
import { MentorsService } from '../mentors/service/mentors.service';
import { jwtUser } from '../dto/jwt-user.interface';
import { BocalsService } from '../bocals/service/bocals.service';
import { CreateBocalDto } from '../dto/bocals/create-bocal.dto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private cadetsService: CadetsService,
    private mentorsService: MentorsService,
    private bocalsService: BocalsService,
  ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize?client_id=${process.env.UID_42}&redirect_uri=${process.env.REDIRECT_42}`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: process.env.UID_42,
      clientSecret: process.env.SECRET_42,
      callbackURL: process.env.REDIRECT_42,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    const {
      login: intraId,
      image_url: profileImage,
      alumnized_at: isCommon,
    } = profile._json;
    // 첫 로그인이면 가입 처리
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
    } else if (profile._json['staff?']) {
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
    done(null, { id: result.id, name: result.intraId, role: result.role });
  }
}
