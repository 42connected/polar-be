import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { Injectable } from '@nestjs/common';
import { CadetsService } from 'src/cadets/cadets.service';
import { MentorsService } from 'src/mentors/mentors.service';
import { CreateMentorDto } from 'src/dto/create-mentor.dto';
import { CreateCadetDto } from 'src/dto/create-cadet.dto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private cadetsService: CadetsService,
    private mentorsService: MentorsService,
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
    cb: any,
  ) {
    const {
      login: intraId,
      image_url: profileImage,
      alumnized_at: isCommon,
    } = profile._json;
    // 첫 로그인이면 가입 처리
    if (intraId.startsWith('m-')) {
      if (this.mentorsService.findByIntra(intraId) === null) {
        const user: CreateMentorDto = {
          intraId,
          profileImage,
        };
        this.mentorsService.createUser(user);
      }
    } else {
      if (this.cadetsService.findByIntra(intraId) === null) {
        const user: CreateCadetDto = {
          intraId,
          profileImage,
          isCommon: isCommon === null ? true : false,
        };
        this.cadetsService.createUser(user);
      }
    }
    // 토큰 생성

    cb(null, profile);
  }
}
